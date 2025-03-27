import NextAuth, { DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    const tokens = await response.json()
    if (!response.ok) {
      throw new Error(tokens.error || 'Failed to refresh token')
    }

    return {
      access_token: tokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refresh_token: tokens.refresh_token ?? refreshToken,
      id_token: tokens.id_token
    }
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    return { error: 'RefreshTokenError' }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: { params: { access_type: 'offline', prompt: 'consent' } }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login'
  },
  callbacks: {
    async jwt ({ token, account }) {
      // ? Este comentario es para ver el token que se recibe en la consola
      // ? Esto se mostrara en la consola del servidor o VSCode
      console.log({ token: token.id_token })
      if (account) {
        const res = await fetch(
          `${process.env.API_SERVICE_URL}/api/v1/get-user-info`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${account.id_token}`
            }
          }
        )

        if (!res.ok) {
          throw new Error('Failed to fetch user info')
        }

        const data = await res.json()

        return {
          ...token,
          id_token: account.id_token || '',
          access_token: account.access_token || '',
          expires_at: account.expires_at || 0,
          refresh_token: account.refresh_token || '',
          role: data.role || '',
          permissions: data.permissions || []
        } as JWT
      }

      if (Date.now() < token.expires_at * 1000) {
        return token
      }

      if (!token.refresh_token) {
        console.error('No refresh token available')
        return { ...token, error: 'RefreshTokenError' }
      }

      const refreshedToken = await refreshAccessToken(token.refresh_token)

      return { ...token, ...refreshedToken } as JWT
    },
    async session ({ session, token }) {
      session.error = token.error as 'RefreshTokenError' | undefined
      session.user.id_token = token.id_token
      session.user.role = token.role
      session.user.permissions = token.permissions
      return session
    }
  }
})

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    error?: 'RefreshTokenError';
    user: {
      id_token?: string;
      role?: string;
      permissions?: string[];
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    id_token: string;
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: 'RefreshTokenError';
    role?: string;
    permissions?: string[];
  }
}
