import { useState } from "react"
import "./App.css"

import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"

import PharmacyDashboard from "./pages/Pharmacy/Dashboard/Dashboard"
import Inventory from "./pages/Pharmacy/Inventory/Inventory"
import Settings from "./pages/Pharmacy/Settings/Settings"
import Billing from "./pages/Pharmacy/Billing/Billing"
import Invoice from "./pages/Pharmacy/Invoices/Invoice"

import DistributorDashboard from "./pages/Distributorside/Dashboard/Dashboard"
import Catalog from "./pages/Distributorside/Catalog/Catalog"
import AdminDashboard from "./pages/Admin/AdminDashboard"

import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

function App() {
  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentRole, setCurrentRole] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  // Application state
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [theme, setTheme] = useState("light")
  const [currentInvoice, setCurrentInvoice] = useState(null)

  // Pharmacy profile
  const [profile, setProfile] = useState({
    pharmacyName: "Apollo Pharmacy",
    ownerName: "Pharmacy Owner",
    phone: "+91 98765 43210",
    email: "apollo@example.com",
    address: "Pune, Maharashtra",
  })

  // Temporary pharmacy inventory data
  const [medicines, setMedicines] = useState([
    {
      name: "Paracetamol 500mg",
      pack: "Strip of 10 tablets",
      category: "Tablets",
      batch: "P24001",
      stock: 120,
      reorder: 50,
      expiry: "2026-09-20",
      price: "25.00",
    },
    {
      name: "Amoxicillin 500mg",
      pack: "Strip of 10 capsules",
      category: "Capsules",
      batch: "AM25012",
      stock: 18,
      reorder: 40,
      expiry: "2026-12-31",
      price: "86.50",
    },
    {
      name: "Cetirizine 10mg",
      pack: "Strip of 10 tablets",
      category: "Tablets",
      batch: "CT26007",
      stock: 65,
      reorder: 30,
      expiry: "2027-02-28",
      price: "32.00",
    },
    {
      name: "Azithromycin 500mg",
      pack: "Strip of 3 tablets",
      category: "Tablets",
      batch: "AZ26003",
      stock: 8,
      reorder: 25,
      expiry: "2026-11-30",
      price: "112.00",
    },
  ])

  // Login
  const handleLogin = (role) => {
    setCurrentRole(role)
    setIsLoggedIn(true)
    setShowRegister(false)
    setCurrentPage("dashboard")
  }

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentRole("")
    setCurrentPage("dashboard")
  }

  // Register
  const handleRegister = () => {
    alert("Registration successful.")
    setShowRegister(false)
  }

  // Registration screen
  if (showRegister) {
    return (
      <Register
        onRegister={handleRegister}
        onLogin={() => setShowRegister(false)}
      />
    )
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
      />
    )
  }

  return (
    <div
      data-theme={theme}
      className="h-screen w-full overflow-hidden theme-page"
    >
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentRole={currentRole}
        onLogout={handleLogout}
      />

      <div className="ml-64 h-screen flex flex-col">
        <Topbar
          profile={profile}
          currentRole={currentRole}
          currentPage={currentPage}
        />

        <main className="flex-1 min-h-0 p-8 overflow-y-auto overflow-x-hidden theme-page">

          {/* PHARMACIST PAGES */}
          {currentRole === "pharmacist" && (
            <>
              {currentPage === "dashboard" && (
                <PharmacyDashboard
                  medicines={medicines}
                  profile={profile}
                />
              )}

              {currentPage === "inventory" && (
                <Inventory
                  medicines={medicines}
                  setMedicines={setMedicines}
                />
              )}

              {currentPage === "billing" && (
                <Billing
                  medicines={medicines}
                  setMedicines={setMedicines}
                  setCurrentInvoice={setCurrentInvoice}
                  setCurrentPage={setCurrentPage}
                />
              )}

              {currentPage === "invoice" && (
                <Invoice
                  invoice={currentInvoice}
                  onClose={() => setCurrentPage("billing")}
                />
              )}

              {currentPage === "settings" && (
                <Settings
                  profile={profile}
                  setProfile={setProfile}
                  theme={theme}
                  setTheme={setTheme}
                />
              )}
            </>
          )}

          {/* DISTRIBUTOR PAGES */}
          {currentRole === "distributor" && (
            <>
              {currentPage === "dashboard" && (
                <DistributorDashboard />
              )}

              {currentPage === "catalog" && (
                <Catalog />
              )}

              {currentPage === "orders" && (
                <div>Distributor Orders</div>
              )}

              {currentPage === "pharmacies" && (
                <div>Connected Pharmacies</div>
              )}

              {currentPage === "notifications" && (
                <div>Distributor Notifications</div>
              )}

              {currentPage === "settings" && (
                <div>Distributor Settings</div>
              )}
            </>
          )}

          {/* ADMIN PAGES */}
          {currentRole === "admin" && (
            <>
              {currentPage === "dashboard" && (
                <AdminDashboard />
              )}

              {currentPage === "pharmacies" && (
                <div>Admin Pharmacies</div>
              )}

              {currentPage === "distributors" && (
                <div>Admin Distributors</div>
              )}

              {currentPage === "users" && (
                <div>Admin Users</div>
              )}

              {currentPage === "settings" && (
                <div>Admin Settings</div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default App