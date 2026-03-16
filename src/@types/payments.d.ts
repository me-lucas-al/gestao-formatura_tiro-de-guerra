type PaymentStatus = {
  PENDING,
  PAID,
  FIRST_INSTALLMENT_PAID,
}

type PaymentMethod = {
  PIX,
  CREDIT_CARD,
  DEBIT_CARD,
  CASH
}

type Payment = {
  id: number
  value: number
  status: PaymentStatus
  method: PaymentMethod
  createdAt: Date
  updatedAt: Date
  atiradorId?: number | null
  familyMemberId?: number | null
  familyMember?: FamilyMember | null
  atirador?: Atirador | null
}
