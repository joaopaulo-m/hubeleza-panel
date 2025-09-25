import { getAffiliateTransactionsAction } from "@/lib/api/actions/affiliate-transaction";
import { AffiliateTransactionItem } from "./affiliate-transaction-item";

interface AffiliateTransactionsListProps {
  name?: string;
  type?: string;
  startDate?: string;
  endDate?: string
}

export async function AffiliateTransactionsList(props: AffiliateTransactionsListProps) {
  const transactions = await getAffiliateTransactionsAction(props)

  return (
    <>
      {transactions.map(transaction => (
        <AffiliateTransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </>
  )
}