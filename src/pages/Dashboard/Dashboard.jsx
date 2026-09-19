import {
  Package,
  AlertTriangle,
  Clock,
  IndianRupee,
} from 'lucide-react'

import StatCard from '../../components/dashboard/StatCard'
import SalesChart from '../../components/dashboard/SalesChart'
import StockStatus from '../../components/dashboard/StockStatus'
import LowStock from '../../components/dashboard/LowStock'
import ExpiringMedicines from '../../components/dashboard/ExpiringMedicines'

function Dashboard() {
  return (
    <div className="w-full">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold theme-text-primary">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#64748B]">
          Here's what's happening with your pharmacy today.
        </p>
      </div>


      {/* ============================= */}
      {/* Statistics Cards */}
      {/* ============================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">

        <StatCard
          title="Total Medicines"
          value="1,248"
          icon={<Package size={22} />}
          trend="+5.2%"
          description="vs last month"
        />

        <StatCard
          title="Low Stock"
          value="23"
          icon={<AlertTriangle size={22} />}
          trend="+3"
          description="this week"
          trendPositive={false}
        />

        <StatCard
          title="Expiring Soon"
          value="14"
          icon={<Clock size={22} />}
          trend="6"
          description="within 30 days"
          trendPositive={false}
        />

        <StatCard
          title="Today's Sales"
          value="₹24,580"
          icon={<IndianRupee size={22} />}
          trend="+8.4%"
          description="vs yesterday"
        />

      </div>


      {/* ============================= */}
      {/* Sales + Stock Status */}
      {/* ============================= */}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">

        {/* Sales Chart */}
        <div className="xl:col-span-2 min-w-0">
          <SalesChart />
        </div>

        {/* Stock Status */}
        <div className="min-w-0">
          <StockStatus />
        </div>

      </div>


      {/* ============================= */}
      {/* Low Stock + Expiring Medicines */}
      {/* ============================= */}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">

        {/* Low Stock */}
        <div className="min-w-0">
          <LowStock />
        </div>

        {/* Expiring Medicines */}
        <div className="min-w-0">
          <ExpiringMedicines />
        </div>

      </div>

    </div>
  )
}

export default Dashboard