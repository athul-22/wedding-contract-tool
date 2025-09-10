export interface Contract {
  id: string
  vendorId: string
  clientName: string
  eventDate: string
  eventVenue: string
  servicePackage: string
  amount: number
  content: string
  status: 'draft' | 'signed'
  signature?: string
  createdAt: string
  updatedAt: string
}

export interface Vendor {
  id: string
  email: string
  name: string
  vendorType: 'photographer' | 'caterer' | 'florist'
}

export interface User extends Vendor {}

declare module 'next-auth' {
  interface Session {
    user: User
  }
  
  interface User {
    vendorType: string
  }
}