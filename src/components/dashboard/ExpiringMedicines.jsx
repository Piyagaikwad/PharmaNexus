import {
  Clock,
  ArrowRight,
} from 'lucide-react'

function ExpiringMedicines() {
  const medicines = [
    {
      name: 'Insulin Glargine',
      batch: 'INS-24051',
      expiry: 'Aug 28, 2026',
      daysLeft: 12,
    },
    {
      name: 'Amoxicillin 500mg',
      batch: 'AMX-24072',
      expiry: 'Sep 05, 2026',
      daysLeft: 20,
    },
    {
      name: 'Azithromycin 500mg',
      batch: 'AZT-24019',
      expiry: 'Sep 15, 2026',
      daysLeft: 30,
    },
    {
      name: 'Cetirizine 10mg',
      batch: 'CTZ-24102',
      expiry: 'Sep 21, 2026',
      daysLeft: 36,
    },
  ]

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b theme-border">

        <div>
          <h2 className="text-lg font-semibold theme-text-primary">
            Expiring Medicines
          </h2>

          <p className="text-sm theme-text-secondary mt-1">
            Medicines approaching expiry
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium theme-primary hover:text-[var(--primary-hover)] transition">
          View All
          <ArrowRight size={16} />
        </button>

      </div>

      {/* Medicines */}
      <div className="divide-y divide-[var(--border)]">

        {medicines.map((medicine) => {

          const urgent = medicine.daysLeft <= 15

          return (
            <div
              key={medicine.batch}
              className="px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-input)] transition"
            >

              {/* Medicine Info */}
              <div className="flex items-center gap-3">

                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    urgent
                      ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
                      : 'bg-[var(--warning)]/10 text-[var(--warning)]'
                  }`}
                >
                  <Clock size={19} />
                </div>

                <div>

                  <p className="text-sm font-medium theme-text-primary">
                    {medicine.name}
                  </p>

                  <p className="text-xs theme-text-secondary mt-0.5">
                    Batch: {medicine.batch}
                  </p>

                </div>

              </div>

              {/* Expiry */}
              <div className="text-right">

                <p className="text-sm theme-text-primary">
                  {medicine.expiry}
                </p>

                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    urgent
                      ? 'text-[var(--danger)]'
                      : 'text-[var(--warning)]'
                  }`}
                >
                  {medicine.daysLeft} days left
                </p>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default ExpiringMedicines