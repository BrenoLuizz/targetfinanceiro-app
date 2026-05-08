import { useSQLiteContext } from 'expo-sqlite'

export type TransactionDTO = {
  id: number
  target_id: number
  amount: number
  observation: string
  created_at: string
  updated_at: string
}

type CreateDTO = {
  target_id: number
  amount: number
  observation?: string
}

export function useTransactionsDatabase() {
  const db = useSQLiteContext()

  async function create({
    target_id,
    amount,
    observation,
  }: CreateDTO) {
    await db.runAsync(
      `
        INSERT INTO transactions (
          target_id,
          amount,
          observation
        )
        VALUES (?, ?, ?)
      `,
      [target_id, amount, observation ?? null]
    )
  }

  async function remove(id: number) {
    await db.runAsync(
      `
        DELETE FROM transactions
        WHERE id = ?
      `,
      [id]
    )
  }

  async function listByTargetId(targetId: number) {
    const response = await db.getAllAsync<TransactionDTO>(
      `
        SELECT *
        FROM transactions
        WHERE target_id = ?
        ORDER BY created_at DESC
      `,
      [targetId]
    )

    return response
  }

  return {
    create,
    remove,
    listByTargetId,
  }
}