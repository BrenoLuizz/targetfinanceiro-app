import { openDatabaseAsync } from "expo-sqlite"
import { migrate } from "./migrate"

export async function getDatabase() {
  const db = await openDatabaseAsync("target.db")

  await migrate(db)

  return db
}