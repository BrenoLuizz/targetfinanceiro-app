export type TargetDTO = {
  id: number
  name: string
  amount: number
  created_at: string
  updated_at: string
}

export type TransactionDTO = {
  id: number
  target_id: number
  amount: number
  observation?: string
  created_at: string
  updated_at: string
}