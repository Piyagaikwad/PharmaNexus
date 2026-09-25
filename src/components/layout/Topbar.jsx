import {
  Bell,
  ChevronDown,
} from "lucide-react"

function Topbar({ profile, currentRole }) {
  const roleData = {
    pharmacist: {
      name: profile?.pharmacyName || "Pharmacy",
      person: profile?.ownerName || "Pharmacy Owner",
    },

    distributor: {
      name: "Medico Distributors",
      person: "Distributor Owner",
    },

    admin: {
      name: "PharmaNexus Admin",
      person: "Administrator",
    },
  }

  const currentUser = roleData[currentRole] || roleData.pharmacist

  const initials = currentUser.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="h-20 theme-card border-b theme-border flex items-center justify-end px-8">
      
      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative theme-text-secondary hover:text-[var(--primary)] transition">
          <Bell size={21} />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#DC2626] rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-[var(--border)]" />

        {/* Profile */}
        <button className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#159A9C] flex items-center justify-center text-white font-semibold">
            {initials}
          </div>

          {/* Name */}
          <div className="text-left">
            <p className="text-sm font-semibold theme-text-primary">
              {currentUser.name}
            </p>

            <p className="text-xs theme-text-secondary">
              {currentUser.person}
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