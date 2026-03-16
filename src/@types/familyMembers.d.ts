type FamilyMember = {
  id: number
  name: string
  age: number
  atiradorId: number
  createdAt: Date
  updatedAt: Date
  paymentId?: number | null
  payment?: Payment | null
  atirador: Atirador
}