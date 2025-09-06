import { getInviteTokens } from "@/lib/api/actions/invite-token"
import { InviteItem } from "./invite-item"

interface InvitesListProps {
  name?: string
  startDate?: string
  endDate?: string
}

export async function InvitesList(props: InvitesListProps) {
  const invites = await getInviteTokens({
    name: props.name,
    start_date: props.startDate,
    end_date: props.endDate
  })

  return (
    <>
      {invites.map((invite) => (
        <InviteItem
          key={invite.id}
          inviteToken={invite}
        />
      ))}
    </>
  )
}