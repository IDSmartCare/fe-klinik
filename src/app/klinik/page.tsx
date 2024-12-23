import { authOption } from "@/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOption);

  return (
    <p>
      {session?.user.package} {session?.user.type} {session?.user.role}
      {session?.user.idFasyankes} {session?.user.idProfile}
    </p>
  );
}
