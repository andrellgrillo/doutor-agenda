import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { userToClinicTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { SignOut } from "./components/signOut";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  // Preciso pegar o nome da clínica do usuário
  const clinic = await db.query.userToClinicTable.findFirst({
    where: eq(userToClinicTable.userId, session.user.id),
  });

  if (!clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      <SignOut />
    </div>
  );
}
