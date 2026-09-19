import { useState } from "react"
import "./App.css"

import Sidebar from "./components/layout/Sidebar"
import Topbar from "./components/layout/Topbar"
import Dashboard from "./pages/Dashboard/Dashboard"
import Inventory from "./pages/Inventory/Inventory"
import Settings from "./pages/Settings/Settings"
import Billing from "./pages/Billing/Billing"
import Invoice from "./pages/Invoices/Invoice"

import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import DistributorDashboard from "./pages/Distributor/DistributorDashboard"

function App() {
  // Authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentRole, setCurrentRole] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  // Pharmacy state
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [theme, setTheme] = useState("light")
  const [currentInvoice, setCurrentInvoice] = useState(null)

  const [profile, setProfile] = useState({
    pharmacyName: "Apollo Pharmacy",
    ownerName: "Pharmacy Owner",
    phone: "+91 98765 43210",
    email: "apollo@example.com",
    address: "Pune, Maharashtra",
  })

  // Temporary shared inventory data
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

  // Admin dashboard
  if (currentRole === "admin") {
    return <AdminDashboard />
  }

  // Distributor dashboard
  if (currentRole === "distributor") {
    return <DistributorDashboard />
  }

  // Pharmacist application
  return (
    <div
      data-theme={theme}
      className="h-screen w-full overflow-hidden theme-page"
    >
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="ml-64 h-screen flex flex-col">
        <Topbar profile={profile} />

        <main className="flex-1 min-h-0 p-8 overflow-y-auto overflow-x-hidden theme-page">
          {currentPage === "dashboard" && (
            <Dashboard
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
        </main>
      </div>
    </div>
  )
}

export default App