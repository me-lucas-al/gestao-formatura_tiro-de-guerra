type Atirador = {
  id: number
  name: string
  number: number
  createdAt: Date
  updatedAt: Date
  adminId: number
  paymentId?: number | null
  payment?: Payment | null
  admin: Admin
  familyMembers: FamilyMember[]
}