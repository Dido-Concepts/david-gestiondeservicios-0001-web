/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects () {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true
      }
    ]
  },
  images: {
    domains: ['lh3.googleusercontent.com'] // Permite este dominio de imagen
  }
}

export default nextConfig
