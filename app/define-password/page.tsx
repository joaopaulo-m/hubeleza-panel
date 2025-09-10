import { sendToDefinePassword } from "@/lib/api/actions/auth";

type DefinePasswordPageProps = {
  searchParams: Promise<{
    id: string
  }>;
}

export default async function DefinePasswordPage(props: DefinePasswordPageProps) {
  const searchParams = await props.searchParams
  await sendToDefinePassword(searchParams.id)

  return (
    <div>Carregando...</div>
  )
}