import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const testVendors = [
  {
    id: '1',
    email: 'photographer@test.com',
    password: '$2b$10$zvApG4Lh28U2yPUZlx5Ife/ye260VaLqIlxIFOH.nmRjtoYBDiSTK', // password123
    name: 'Sarah Johnson',
    vendorType: 'photographer'
  },
  {
    id: '2', 
    email: 'caterer@test.com',
    password: '$2b$10$zvApG4Lh28U2yPUZlx5Ife/ye260VaLqIlxIFOH.nmRjtoYBDiSTK', // password123
    name: 'Mike Chen',
    vendorType: 'caterer'
  },
  {
    id: '3',
    email: 'florist@test.com', 
    password: '$2b$10$zvApG4Lh28U2yPUZlx5Ife/ye260VaLqIlxIFOH.nmRjtoYBDiSTK', // password123
    name: 'Emily Rose',
    vendorType: 'florist'
  }
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const vendor = testVendors.find(v => v.email === credentials.email)
        if (!vendor) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, vendor.password)
        if (!isValid) {
          return null
        }

        return {
          id: vendor.id,
          email: vendor.email,
          name: vendor.name,
          vendorType: vendor.vendorType
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.vendorType = (user as any).vendorType
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).vendorType = token.vendorType
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }