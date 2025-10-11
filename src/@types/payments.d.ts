type Payment = {
  id: number;
  amount: number;
  isPaid: boolean;
  atiradorId: number;
  createdAt: string;
  updatedAt: string;
}

enum PaymentStatus {
  "PENDING",
  "PAID",
  "CANCELED"
}

enum PaymentMethod {
  "PIX",
  "CREDIT_CARD",
  "DEBIT_CARD",
  "CASH"
}