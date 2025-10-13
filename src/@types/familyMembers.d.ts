type FamilyMember = {
  id: number
  name: string
  atiradorId: number
  isPaid: boolean
  createdAt: Date
  updatedAt: Date
  paymentId?: number | null
  payment?: Payment | null
  atirador: Atirador
}