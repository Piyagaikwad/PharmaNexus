import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

function StockStatus() {
  const stockData = [
    {
      label: 'In Stock',
      count: 1120,
      percentage: 89.7,
      icon: CheckCircle2,
      iconColor: 'text-[var(--success)]',
      bgColor: 'bg-[var(--success)]/10',
    },
    {
      label: 'Low Stock',
      count: 23,
      percentage: 1.8,
      icon: AlertTriangle,
      iconColor: 'text-[var(--warning)]',
      bgColor: 'bg-[var(--warning)]/10',
    },
    {
      label: 'Out of Stock',
      count: 105,
      percentage: 8.5,
      icon: XCircle,
      iconColor: 'text-[var(--danger)]',
      bgColor: 'bg-[var(--danger)]/10',
    },
  ]

  return (
    <div className="theme-card rounded-xl p-6 h-full">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold theme-text-primary">
          Stock Status
        </h2>

        <p className="text-sm theme-text-secondary mt-1">
          Current inventory status
        </p>
      </div>

      {/* Stock Items */}
      <div className="space-y-5">

        {stockData.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >

              {/* Left */}
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon
                    size={20}
                    className={item.iconColor}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium theme-text-primary">
                    {item.label}
                  </p>

                  <p className="text-xs theme-text-secondary mt-0.5">
                    {item.count} medicines
                  </p>
                </div>

              </div>

              {/* Percentage */}
              <span className="text-sm font-semibold theme-text-primary">
                {item.percentage}%
              </span>

            </div>
          )
        })}

      </div>

      {/* View Inventory */}
      <button className="mt-8 w-full py-2.5 text-sm font-medium theme-primary border border-[var(--primary)]/30 rounded-lg hover:bg-[var(--primary)]/5 transition">
        View Inventory
      </button>

    </div>
  )
}

export default StockStatus