import {
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

function LowStock() {
  const medicines = [
    {
      name: 'Paracetamol 500mg',
      category: 'Tablet',
      currentStock: 12,
      reorderLevel: 50,
    },
    {
      name: 'Amoxicillin 500mg',
      category: 'Capsule',
      currentStock: 8,
      reorderLevel: 30,
    },
    {
      name: 'Cetirizine 10mg',
      category: 'Tablet',
      currentStock: 5,
      reorderLevel: 25,
    },
    {
      name: 'Azithromycin 500mg',
      category: 'Tablet',
      currentStock: 3,
      reorderLevel: 20,
    },
  ]

  return (
    <div className="theme-card rounded-xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b theme-border">

        <div>
          <h2 className="text-lg font-semibold theme-text-primary">
            Low Stock Medicines
          </h2>

          <p className="text-sm theme-text-secondary mt-1">
            Medicines that need restocking
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium theme-primary hover:text-[var(--primary-hover)] transition">
          View All
          <ArrowRight size={16} />
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="bg-[var(--bg-input)] theme-text-secondary">

              <th className="text-left font-medium px-6 py-3">
                Medicine
              </th>

              <th className="text-left font-medium px-6 py-3">
                Category
              </th>

              <th className="text-center font-medium px-6 py-3">
                Current Stock
              </th>

              <th className="text-center font-medium px-6 py-3">
                Reorder Level
              </th>

              <th className="text-center font-medium px-6 py-3">
                Status
              </th>

            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">

            {medicines.map((medicine) => {

              const critical =
                medicine.currentStock <= medicine.reorderLevel * 0.25

              return (
                <tr
                  key={medicine.name}
                  className="hover:bg-[var(--bg-input)] transition"
                >

                  {/* Medicine */}
                  <td className="px-6 py-4">

                    <p className="font-medium theme-text-primary">
                      {medicine.name}
                    </p>

                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 theme-text-secondary">
                    {medicine.category}
                  </td>

                  {/* Current Stock */}
                  <td className="px-6 py-4 text-center">

                    <span
                      className={`font-semibold ${
                        critical
                          ? 'text-[var(--danger)]'
                          : 'text-[var(--warning)]'
                      }`}
                    >
                      {medicine.currentStock}
                    </span>

                  </td>

                  {/* Reorder Level */}
                  <td className="px-6 py-4 text-center theme-text-secondary">
                    {medicine.reorderLevel}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">

                    <div className="flex justify-center">

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          critical
                            ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
                            : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                        }`}
                      >

                        <AlertTriangle size={13} />

                        {critical ? 'Critical' : 'Low Stock'}

                      </span>

                    </div>

                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default LowStock