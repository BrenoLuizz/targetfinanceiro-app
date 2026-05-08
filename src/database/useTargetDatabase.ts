import { useSQLiteContext } from 'expo-sqlite'

export type TargetDTO = {
  id: number
  name: string
  amount: number
  current: number
  percentage: number
  created_at: string
  updated_at: string
}

type CreateDTO = {
  name: string
  amount: number
}

type UpdateDTO = {
  id: number
  name: string
  amount: number
}

export function useTargetDatabase() {
  const db = useSQLiteContext()

  async function create({ name, amount }: CreateDTO) {
    await db.runAsync(
      `
        INSERT INTO targets (name, amount)
        VALUES (?, ?)
      `,
      [name, amount]
    )
  }

  async function update({ id, name, amount }: UpdateDTO) {
    await db.runAsync(
      `
        UPDATE targets
        SET
          name = ?,
          amount = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [name, amount, id]
    )
  }

  async function remove(id: number) {
    await db.runAsync(
      `
        DELETE FROM targets
        WHERE id = ?
      `,
      [id]
    )
  }

  async function show(id: number) {
    const response = await db.getFirstAsync<TargetDTO>(
      `
        SELECT
          t.*,
          COALESCE(SUM(tr.amount), 0) AS current,

          CASE
            WHEN t.amount > 0
            THEN (COALESCE(SUM(tr.amount), 0) * 100.0 / t.amount)
            ELSE 0
          END AS percentage

        FROM targets t

        LEFT JOIN transactions tr
          ON tr.target_id = t.id

        WHERE t.id = ?

        GROUP BY t.id
      `,
      [id]
    )

    return response
  }

  async function list() {
    const response = await db.getAllAsync<TargetDTO>(
      `
        SELECT
          t.*,
          COALESCE(SUM(tr.amount), 0) AS current,

          CASE
            WHEN t.amount > 0
            THEN (COALESCE(SUM(tr.amount), 0) * 100.0 / t.amount)
            ELSE 0
          END AS percentage

        FROM targets t

        LEFT JOIN transactions tr
          ON tr.target_id = t.id

        GROUP BY t.id

        ORDER BY percentage DESC,
                 t.updated_at DESC
      `
    )

    return response
  }

  return {
    create,
    update,
    remove,
    show,
    list,
  }
}