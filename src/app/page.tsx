import { db } from "@/db";
const teste = await db.query.usersTable.findMany()

export default function Home() {
  return <div>{teste[0].name}</div>;
}
