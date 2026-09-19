import {
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react'

function Topbar({ profile}) {
  return (
    <header className="h-20 theme-card border-b theme-border flex items-center justify-between px-8">

      {/* Search */}
      <div className="relative w-96">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-secondary"
        />

        <input
          type="text"
          placeholder="Search medicines, invoices, distributors..."
          className="w-full pl-10 pr-4 py-2.5 theme-input border border-[var(--border)] rounded-lg text-sm theme-text-primary placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative theme-text-secondary hover:theme-primary transition">
          <Bell size={21} />

          {/* Notification indicator */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px theme-border bg-[var(--border)]" />

        {/* Pharmacy Profile */}
        <button className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#159A9C] flex items-center justify-center text-white font-semibold">
            {profile.pharmacyName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          {/* Name */}
          <div className="text-left">
            <p className="text-sm font-semibold theme-text-primary">
              {profile.pharmacyName}
            </p>

            <p className="text-xs theme-text-secondary">
              {profile.ownerName}
            </p>
          </div>

          <ChevronDown
            size={18}
            className="theme-text-secondary"
          />

        </button>

      </div>

    </header>
  )
}

export default Topbar