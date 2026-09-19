import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const salesData = [
  { day: 'Mon', sales: 18500 },
  { day: 'Tue', sales: 22300 },
  { day: 'Wed', sales: 19800 },
  { day: 'Thu', sales: 25100 },
  { day: 'Fri', sales: 23800 },
  { day: 'Sat', sales: 28900 },
  { day: 'Sun', sales: 24580 },
]

function SalesChart() {
  return (
    <div className="theme-card rounded-xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-lg font-semibold theme-text-primary">
            Sales Overview
          </h2>

          <p className="text-sm theme-text-secondary mt-1">
            Sales performance for the last 7 days
          </p>
        </div>

        {/* Period Selector */}
        <select className="text-sm theme-input border border-[var(--border)] rounded-lg px-3 py-2 theme-text-secondary focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 12 Months</option>
        </select>

      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[320px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={salesData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: 'var(--text-secondary)',
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: 'var(--text-secondary)',
              }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString('en-IN')}`,
                'Sales',
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: 'var(--bg-card)',
              }}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  )
}

export default SalesChart