import { authOption } from "@/auth"
import { getServerSession } from "next-auth"

export default async function Home() {
  const session = await getServerSession(authOption)
  console.log(session);

  return (
    <p>Dashboard</p>
  )
}
