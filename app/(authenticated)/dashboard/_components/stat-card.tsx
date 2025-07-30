import type { ElementType } from "react"

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: ElementType
  color: string
}

export const StatCard = (props: StatCardProps) => {
  const { title, value, change, icon: Icon, color } = props;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} vs mês anterior
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}