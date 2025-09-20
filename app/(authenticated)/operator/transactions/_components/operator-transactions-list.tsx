import { getOperatorTransactionsAction } from "@/lib/api/actions/operator";
import { OperatorTransactionItem } from "./operator-transaction-item";

interface OperatorTransactionsListProps {
  partnerName?: string;
  startDate?: string;
  endDate?: string
}

export async function OperatorTransactionsList(props: OperatorTransactionsListProps) {
  const transactions = await getOperatorTransactionsAction({
    partner_name: props.partnerName,
    start_date: props.startDate,
    end_date: props.endDate
  })

  return (
    <>
      {transactions.map((transaction) => (
        <OperatorTransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </>
  )
}