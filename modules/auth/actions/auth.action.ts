'use server'

import { signIn, signOut } from '@/config/auth'

export async function SignInOnServer () {
  await signIn('google', { redirectTo: '/dashboard' })
}

export async function signOutOnServer () {
  await signOut({ redirectTo: '/login' })
}
