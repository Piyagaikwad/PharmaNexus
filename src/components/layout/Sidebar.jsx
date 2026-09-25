import {
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  Truck,
  BarChart3,
  Bell,
  Settings,
  Building2,
  Users,
  Store,
  LogOut,
} from 'lucide-react'

function Sidebar({ currentPage, setCurrentPage, currentRole, onLogout }) {

  const pharmacyMenu = [
    {
      name: 'Dashboard',
      page: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Inventory',
      page: 'inventory',
      icon: Package,
    },
    {
      name: 'Billing',
      page: 'billing',
      icon: Receipt,
    },
    {
      name: 'Purchases',
      page: 'purchases',
      icon: ShoppingCart,
    },
    {
      name: 'Distributors',
      page: 'distributors',
      icon: Truck,
    },
  ]

  const pharmacySecondaryMenu = [
    {
      name: 'Analytics',
      page: 'analytics',
      icon: BarChart3,
    },
    {
      name: 'Alerts',
      page: 'alerts',
      icon: Bell,
    },
  ]

  const distributorMenu = [
    {
      name: 'Dashboard',
      page: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Catalog & Stock',
      page: 'catalog',
      icon: Package,
    },
    {
      name: 'Orders',
      page: 'orders',
      icon: ShoppingCart,
    },
    {
      name: 'Pharmacies',
      page: 'pharmacies',
      icon: Building2,
    },
    {
      name: 'Notifications',
      page: 'notifications',
      icon: Bell,
    },
  ]

  const adminMenu = [
    {
      name: 'Dashboard',
      page: 'dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Pharmacies',
      page: 'pharmacies',
      icon: Store,
    },
    {
      name: 'Distributors',
      page: 'distributors',
      icon: Truck,
    },
    {
      name: 'Users',
      page: 'users',
      icon: Users,
    },
  ]

  let mainMenu = []
  let secondaryMenu = []

  if (currentRole === 'distributor') {
    mainMenu = distributorMenu
  } else if (currentRole === 'admin') {
    mainMenu = adminMenu
  } else {
    mainMenu = pharmacyMenu
    secondaryMenu = pharmacySecondaryMenu
  }

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0F2742] text-white flex flex-col">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">
          Pharma<span className="text-[#35C6C8]">Nexus</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 ">

        {/* Main Navigation */}
        <div className="space-y-2">
          {mainMenu.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.page}
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.page
                    ? 'bg-[#159A9C] text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* Pharmacy Secondary Navigation */}
        {secondaryMenu.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
            {secondaryMenu.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.page}
                  onClick={() => setCurrentPage(item.page)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    currentPage === item.page
                      ? 'bg-[#159A9C] text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-5 border-t border-white/10 space-y-2">

        {/* Settings */}
        <button
          onClick={() => setCurrentPage('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentPage === 'settings'
              ? 'bg-[#159A9C] text-white'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar