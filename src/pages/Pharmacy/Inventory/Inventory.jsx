import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  MoreVertical,
} from "lucide-react"

import { useState } from "react"

function Inventory({medicines, setMedicines}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [stockStatus, setStockStatus] = useState("All Status")
  const [category, setCategory] = useState("All Categories")
  const [expiryStatus, setExpiryStatus] = useState("All Medicines")

  const [showAddMedicine, setShowAddMedicine] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [editingMedicine, setEditingMedicine] = useState(null)

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    pack: "",
    category: "",
    batch: "",
    stock: "",
    reorder: "",
    expiry: "",
    price: "",
  })

  const totalMedicines = medicines.length

  const inStockCount = medicines.filter(
    (medicine) => medicine.stock > medicine.reorder
  ).length

  const lowStockCount = medicines.filter(
    (medicine) =>
      medicine.stock > 0 &&
      medicine.stock <= medicine.reorder
  ).length

  const outOfStockCount = medicines.filter(
    (medicine) => medicine.stock === 0
  ).length

  const filteredMedicines = medicines.filter((medicine) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      medicine.name.toLowerCase().includes(search) ||
      medicine.category.toLowerCase().includes(search) ||
      medicine.batch.toLowerCase().includes(search)

    const matchesStock =
      stockStatus === "All Status" ||
      (stockStatus === "In Stock" &&
        medicine.stock > medicine.reorder) ||
      (stockStatus === "Low Stock" &&
        medicine.stock > 0 &&
        medicine.stock <= medicine.reorder) ||
      (stockStatus === "Out of Stock" &&
        medicine.stock === 0)

    const matchesCategory =
      category === "All Categories" ||
      medicine.category === category

    const today = new Date()
    const expiryDate = new Date(medicine.expiry)

    const daysUntilExpiry =
      (expiryDate - today) /
      (1000 * 60 * 60 * 24)

    const matchesExpiry =
      expiryStatus === "All Medicines" ||
      (expiryStatus === "Expiring within 30 days" &&
        daysUntilExpiry >= 0 &&
        daysUntilExpiry <= 30) ||
      (expiryStatus === "Expiring within 90 days" &&
        daysUntilExpiry >= 0 &&
        daysUntilExpiry <= 90) ||
      (expiryStatus === "Expired" &&
        daysUntilExpiry < 0)

    return (
      matchesSearch &&
      matchesStock &&
      matchesCategory &&
      matchesExpiry
    )
  })

  const handleAddMedicine = () => {
    if (
      !newMedicine.name ||
      !newMedicine.pack ||
      !newMedicine.category ||
      !newMedicine.batch ||
      !newMedicine.stock ||
      !newMedicine.reorder ||
      !newMedicine.expiry ||
      !newMedicine.price
    ) {
      alert("Please fill in all fields.")
      return
    }

    if (
      Number(newMedicine.stock) < 0 ||
      Number(newMedicine.reorder) < 0
    ) {
      alert("Stock and reorder level cannot be negative.")
      return
    }

    if (Number(newMedicine.price) <= 0) {
      alert("Selling price must be greater than 0.")
      return
    }

    const duplicateBatch = medicines.some(
      (medicine) =>
        medicine.batch.toLowerCase() ===
        newMedicine.batch.toLowerCase()
    )

    if (duplicateBatch) {
      alert("A medicine with this batch number already exists.")
      return
    }

    const medicine = {
      ...newMedicine,
      stock: Number(newMedicine.stock),
      reorder: Number(newMedicine.reorder),
      price: `₹${Number(newMedicine.price).toFixed(2)}`,
    }

    setMedicines((currentMedicines) => [
      ...currentMedicines,
      medicine,
    ])

    setNewMedicine({
      name: "",
      pack: "",
      category: "",
      batch: "",
      stock: "",
      reorder: "",
      expiry: "",
      price: "",
    })

    setShowAddMedicine(false)
  }

  const handleDeleteMedicine = (batch) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?"
    )

    if (!confirmed) return

    setMedicines((currentMedicines) =>
      currentMedicines.filter(
        (medicine) => medicine.batch !== batch
      )
    )
  }

  const handleEditMedicine = (medicine) => {
    setEditingMedicine({
      ...medicine,
      originalBatch: medicine.batch,
      price: medicine.price.replace("₹", ""),
    })

    setOpenMenu(null)
  }

  const handleSaveEdit = () => {
    if (
      !editingMedicine.name ||
      !editingMedicine.pack ||
      !editingMedicine.category ||
      !editingMedicine.batch ||
      editingMedicine.stock === "" ||
      editingMedicine.reorder === "" ||
      !editingMedicine.expiry ||
      !editingMedicine.price
    ) {
      alert("Please fill in all fields.")
      return
    }

    if (
      Number(editingMedicine.stock) < 0 ||
      Number(editingMedicine.reorder) < 0
    ) {
      alert("Stock and reorder level cannot be negative.")
      return
    }

    if (Number(editingMedicine.price) <= 0) {
      alert("Selling price must be greater than 0.")
      return
    }

    const duplicateBatch = medicines.some(
      (medicine) =>
        medicine.batch.toLowerCase() ===
          editingMedicine.batch.toLowerCase() &&
        medicine.batch !== editingMedicine.originalBatch
    )

    if (duplicateBatch) {
      alert("Another medicine already uses this batch number.")
      return
    }

    setMedicines((currentMedicines) =>
      currentMedicines.map((medicine) =>
        medicine.batch === editingMedicine.originalBatch
          ? {
              ...editingMedicine,
              stock: Number(editingMedicine.stock),
              reorder: Number(editingMedicine.reorder),
              price: `₹${Number(
                editingMedicine.price
              ).toFixed(2)}`,
            }
          : medicine
      )
    )

    setEditingMedicine(null)
  }

  return (
    <div className="w-full">

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary">
            Inventory
          </h1>

          <p className="mt-1 text-sm theme-text-secondary">
            Manage your medicines, stock levels and expiry dates.
          </p>
        </div>

        <button
          onClick={() => setShowAddMedicine(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          <Plus size={18} />
          Add Medicine
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="theme-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-secondary">
                Total Medicines
              </p>

              <h2 className="mt-2 text-2xl font-bold theme-text-primary">
                {totalMedicines}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--primary)]/10 theme-primary">
              <Package size={22} />
            </div>
          </div>
        </div>

        <div className="theme-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-secondary">
                In Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold theme-text-primary">
                {inStockCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--success)]/10 text-[var(--success)]">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="theme-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-secondary">
                Low Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold theme-text-primary">
                {lowStockCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--warning)]/10 text-[var(--warning)]">
              <AlertTriangle size={22} />
            </div>
          </div>
        </div>

        <div className="theme-card rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm theme-text-secondary">
                Out of Stock
              </p>

              <h2 className="mt-2 text-2xl font-bold theme-text-primary">
                {outOfStockCount}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--danger)]/10 text-[var(--danger)]">
              <XCircle size={22} />
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 theme-card rounded-xl p-5">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="flex-1">
            <label className="mb-2 block text-xs font-medium theme-text-secondary">
              Search Medicine
            </label>

            <input
              type="text"
              placeholder="Search by medicine name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="theme-input h-10 w-full rounded-lg border border-[var(--border)] px-4 text-sm theme-text-primary outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="w-full lg:w-52">
            <label className="mb-2 block text-xs font-medium theme-text-secondary">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="theme-input h-10 w-full rounded-lg border border-[var(--border)] px-3 text-sm theme-text-primary outline-none focus:border-[var(--primary)]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Tablets">Tablets</option>
              <option value="Capsules">Capsules</option>
              <option value="Syrups">Syrups</option>
              <option value="Injections">Injections</option>
              <option value="Creams">Creams</option>
            </select>
          </div>

          <div className="w-full lg:w-52">
            <label className="mb-2 block text-xs font-medium theme-text-secondary">
              Stock Status
            </label>

            <select
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value)}
              className="theme-input h-10 w-full rounded-lg border border-[var(--border)] px-3 text-sm theme-text-primary outline-none focus:border-[var(--primary)]"
            >
              <option value="All Status">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="w-full lg:w-52">
            <label className="mb-2 block text-xs font-medium theme-text-secondary">
              Expiry
            </label>

            <select
              value={expiryStatus}
              onChange={(e) => setExpiryStatus(e.target.value)}
              className="theme-input h-10 w-full rounded-lg border border-[var(--border)] px-3 text-sm theme-text-primary outline-none focus:border-[var(--primary)]"
            >
              <option value="All Medicines">All Medicines</option>
              <option value="Expiring within 30 days">
                Expiring within 30 days
              </option>
              <option value="Expiring within 90 days">
                Expiring within 90 days
              </option>
              <option value="Expired">Expired</option>
            </select>
          </div>

        </div>
      </div>

      <div className="mt-6 theme-card overflow-hidden rounded-xl">

        <div className="border-b theme-border px-5 py-4">
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold theme-text-primary">
                Medicine Inventory
              </h2>

              <p className="mt-1 text-xs theme-text-secondary">
                Manage your current medicine stock.
              </p>
            </div>

            <span className="text-sm theme-text-secondary">
              {filteredMedicines.length} medicines
            </span>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b theme-border bg-[var(--bg-input)]">

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Medicine
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Batch
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Stock
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Expiry
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold theme-text-secondary">
                  Selling Price
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold theme-text-secondary">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredMedicines.length > 0 ? (

                filteredMedicines.map((medicine, index) => (

                  <tr
                    key={medicine.batch}
                    className={`border-b theme-border hover:bg-[var(--bg-input)] ${
                      index === filteredMedicines.length - 1
                        ? "border-b-0"
                        : ""
                    }`}
                  >

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium theme-text-primary">
                        {medicine.name}
                      </p>

                      <p className="mt-1 text-xs theme-text-secondary">
                        {medicine.pack}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm theme-text-secondary">
                      {medicine.category}
                    </td>

                    <td className="px-5 py-4 text-sm theme-text-secondary">
                      {medicine.batch}
                    </td>

                    <td className="px-5 py-4">

                      <p
                        className={`text-sm font-medium ${
                          medicine.stock <= medicine.reorder
                            ? medicine.stock <= medicine.reorder / 2
                              ? "text-[var(--danger)]"
                              : "text-[var(--warning)]"
                            : "theme-text-primary"
                        }`}
                      >
                        {medicine.stock}
                      </p>

                      <p
                        className={`text-xs ${
                          medicine.stock <= medicine.reorder
                            ? medicine.stock <= medicine.reorder / 2
                              ? "text-[var(--danger)]"
                              : "text-[var(--warning)]"
                            : "theme-text-secondary"
                        }`}
                      >
                        Reorder: {medicine.reorder}
                      </p>

                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm theme-text-primary">
                        {new Date(
                          medicine.expiry
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium theme-text-primary">
                      {medicine.price}
                    </td>

                    <td className="px-5 py-4 text-right">

                      <div className="relative inline-block">

                        <button
                          onClick={() =>
                            setOpenMenu(
                              openMenu === medicine.batch
                                ? null
                                : medicine.batch
                            )
                          }
                          className="rounded-lg p-2 theme-text-secondary hover:bg-[var(--bg-input)] hover:theme-text-primary"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === medicine.batch && (

                          <div className="absolute right-0 top-10 z-20 w-32 theme-card rounded-lg py-1 text-left shadow-lg">

                            <button
                              className="w-full px-3 py-2 text-sm theme-text-primary hover:bg-[var(--bg-input)]"
                              onClick={() => {
                                setSelectedMedicine(medicine)
                                setOpenMenu(null)
                              }}
                            >
                              View
                            </button>

                            <button
                              className="w-full px-3 py-2 text-sm theme-text-primary hover:bg-[var(--bg-input)]"
                              onClick={() =>
                                handleEditMedicine(medicine)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="w-full px-3 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger)]/10"
                              onClick={() => {
                                handleDeleteMedicine(medicine.batch)
                                setOpenMenu(null)
                              }}
                            >
                              Delete
                            </button>

                          </div>

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-input)]">
                        <Package
                          size={22}
                          className="theme-text-secondary"
                        />
                      </div>

                      <p className="text-sm font-medium theme-text-primary">
                        No medicines found
                      </p>

                      <p className="mt-1 text-xs theme-text-secondary">
                        Try changing your search or filter criteria.
                      </p>

                    </div>
                  </td>
                </tr>

              )}

            </tbody>
          </table>
        </div>
      </div>

      {showAddMedicine && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="theme-card w-full max-w-lg rounded-xl shadow-xl">

            <div className="flex items-center justify-between border-b theme-border px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold theme-text-primary">
                  Add Medicine
                </h2>

                <p className="mt-1 text-sm theme-text-secondary">
                  Add a new medicine to your inventory.
                </p>
              </div>

              <button
                onClick={() => setShowAddMedicine(false)}
                className="theme-text-secondary hover:theme-text-primary"
              >
                ✕
              </button>

            </div>

            <div className="px-6 py-6">

              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Medicine Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 500mg"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        name: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Pack Size
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Strip of 10 tablets"
                    value={newMedicine.pack}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        pack: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Category
                  </label>

                  <select
                    value={newMedicine.category}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        category: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  >
                    <option value="">Select Category</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Syrups">Syrups</option>
                    <option value="Injections">Injections</option>
                    <option value="Creams">Creams</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. P26001"
                    value={newMedicine.batch}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        batch: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Current Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    value={newMedicine.stock}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        stock: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Reorder Level
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={newMedicine.reorder}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        reorder: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    value={newMedicine.expiry}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        expiry: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Selling Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 25.00"
                    value={newMedicine.price}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        price: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-3 border-t theme-border px-6 py-4">

              <button
                onClick={() => setShowAddMedicine(false)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium theme-text-secondary hover:bg-[var(--bg-input)]"
              >
                Cancel
              </button>

              <button
                onClick={handleAddMedicine}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
              >
                Add Medicine
              </button>

            </div>

          </div>

        </div>

      )}

      {selectedMedicine && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="theme-card w-full max-w-lg rounded-xl shadow-xl">

            <div className="flex items-center justify-between border-b theme-border px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold theme-text-primary">
                  Medicine Details
                </h2>

                <p className="mt-1 text-sm theme-text-secondary">
                  View medicine information.
                </p>
              </div>

              <button
                onClick={() => setSelectedMedicine(null)}
                className="rounded-lg px-2 py-1 text-xl theme-text-secondary hover:bg-[var(--bg-input)] hover:theme-text-primary"
              >
                ×
              </button>

            </div>

            <div className="grid grid-cols-2 gap-5 px-6 py-6">

              <div>
                <p className="text-xs theme-text-secondary">
                  Medicine Name
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.name}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Pack Size
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.pack}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Category
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.category}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Batch Number
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.batch}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Current Stock
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.stock}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Reorder Level
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.reorder}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Expiry Date
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {new Date(
                    selectedMedicine.expiry
                  ).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs theme-text-secondary">
                  Selling Price
                </p>

                <p className="mt-1 text-sm font-medium theme-text-primary">
                  {selectedMedicine.price}
                </p>
              </div>

            </div>

            <div className="flex justify-end border-t theme-border px-6 py-4">

              <button
                onClick={() => setSelectedMedicine(null)}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {editingMedicine && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="theme-card w-full max-w-lg rounded-xl shadow-xl">

            <div className="flex items-center justify-between border-b theme-border px-6 py-4">

              <div>
                <h2 className="text-lg font-semibold theme-text-primary">
                  Edit Medicine
                </h2>

                <p className="mt-1 text-sm theme-text-secondary">
                  Update medicine information.
                </p>
              </div>

              <button
                onClick={() => setEditingMedicine(null)}
                className="theme-text-secondary hover:theme-text-primary"
              >
                ✕
              </button>

            </div>

            <div className="px-6 py-6">

              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Medicine Name
                  </label>

                  <input
                    type="text"
                    value={editingMedicine.name}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        name: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Pack Size
                  </label>

                  <input
                    type="text"
                    value={editingMedicine.pack}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        pack: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Category
                  </label>

                  <select
                    value={editingMedicine.category}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        category: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Tablets">Tablets</option>
                    <option value="Capsules">Capsules</option>
                    <option value="Syrups">Syrups</option>
                    <option value="Injections">Injections</option>
                    <option value="Creams">Creams</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Batch Number
                  </label>

                  <input
                    type="text"
                    value={editingMedicine.batch}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        batch: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Current Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editingMedicine.stock}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        stock: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Reorder Level
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editingMedicine.reorder}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        reorder: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    value={editingMedicine.expiry}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        expiry: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium theme-text-primary">
                    Selling Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingMedicine.price}
                    onChange={(e) =>
                      setEditingMedicine({
                        ...editingMedicine,
                        price: e.target.value,
                      })
                    }
                    className="theme-input w-full rounded-lg border border-[var(--border)] px-3 py-2.5 text-sm outline-none focus:border-[var(--primary)]"
                  />
                </div>

              </div>
            </div>

            <div className="flex justify-end gap-3 border-t theme-border px-6 py-4">

              <button
                onClick={() => setEditingMedicine(null)}
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium theme-text-secondary hover:bg-[var(--bg-input)]"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Inventory