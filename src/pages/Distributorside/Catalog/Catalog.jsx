import { useMemo, useRef, useState } from "react"
import {
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  CalendarDays,
} from "lucide-react"
import * as XLSX from "xlsx"
import * as pdfjsLib from "pdfjs-dist"

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

const categories = [
  "Tablets",
  "Capsules",
  "Syrups",
  "Injections",
  "Creams",
  "Ointments",
  "Drops",
  "Powders",
  "Suspensions",
  "Solutions",
  "Gels",
  "Sprays",
  "Inhalers",
  "Patches",
  "Suppositories",
  "Lozenges",
  "Granules",
  "Other",
]

const emptyBatch = {
  batchNumber: "",
  stock: "",
  reorderLevel: "",
  mrp: "",
  sellingPrice: "",
  expiry: "",
}

const initialMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    manufacturer: "Cipla",
    category: "Tablets",
    unit: "Strip",
    batches: [
      {
        id: "PCM-001",
        batchNumber: "PCM26001",
        stock: 500,
        reorderLevel: 200,
        mrp: 30,
        sellingPrice: 24,
        expiry: "2027-08-31",
      },
      {
        id: "PCM-002",
        batchNumber: "PCM26002",
        stock: 350,
        reorderLevel: 200,
        mrp: 30,
        sellingPrice: 24,
        expiry: "2027-12-31",
      },
    ],
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    manufacturer: "Sun Pharma",
    category: "Capsules",
    unit: "Strip",
    batches: [
      {
        id: "AMX-001",
        batchNumber: "AMX26012",
        stock: 320,
        reorderLevel: 100,
        mrp: 110,
        sellingPrice: 86,
        expiry: "2027-04-30",
      },
      {
        id: "AMX-002",
        batchNumber: "AMX26018",
        stock: 120,
        reorderLevel: 100,
        mrp: 110,
        sellingPrice: 86,
        expiry: "2027-09-30",
      },
    ],
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    manufacturer: "Dr. Reddy's",
    category: "Tablets",
    unit: "Strip",
    batches: [
      {
        id: "CTZ-001",
        batchNumber: "CTZ26007",
        stock: 75,
        reorderLevel: 150,
        mrp: 40,
        sellingPrice: 32,
        expiry: "2027-02-28",
      },
    ],
  },
  {
    id: 4,
    name: "Azithromycin 500mg",
    manufacturer: "Alembic",
    category: "Tablets",
    unit: "Strip",
    batches: [
      {
        id: "AZM-001",
        batchNumber: "AZM26003",
        stock: 0,
        reorderLevel: 100,
        mrp: 135,
        sellingPrice: 112,
        expiry: "2027-01-31",
      },
    ],
  },
  {
    id: 5,
    name: "Pantoprazole 40mg",
    manufacturer: "Lupin",
    category: "Tablets",
    unit: "Strip",
    batches: [
      {
        id: "PNT-001",
        batchNumber: "PNT26009",
        stock: 420,
        reorderLevel: 100,
        mrp: 95,
        sellingPrice: 72,
        expiry: "2027-06-30",
      },
    ],
  },
]

function Catalog() {
  const fileInputRef = useRef(null)

  const [medicines, setMedicines] = useState(initialMedicines)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const [showMedicineModal, setShowMedicineModal] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)

  const [showViewModal, setShowViewModal] = useState(false)
  const [viewingMedicine, setViewingMedicine] = useState(null)

  const [showImportModal, setShowImportModal] = useState(false)
  const [importRows, setImportRows] = useState([])
  const [importErrors, setImportErrors] = useState([])
  const [importDuplicates, setImportDuplicates] = useState([])
  const [importFileName, setImportFileName] = useState("")
  const [importLoading, setImportLoading] = useState(false)

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        medicine.name.toLowerCase().includes(searchText) ||
        medicine.manufacturer.toLowerCase().includes(searchText) ||
        medicine.batches.some((batch) =>
          batch.batchNumber.toLowerCase().includes(searchText)
        )

      const totalStock = medicine.batches.reduce(
        (sum, batch) => sum + Number(batch.stock || 0),
        0
      )

      const reorderLevel = medicine.batches.reduce(
        (lowest, batch) =>
          lowest === null
            ? Number(batch.reorderLevel || 0)
            : Math.min(lowest, Number(batch.reorderLevel || 0)),
        null
      )

      const matchesCategory =
        categoryFilter === "all" ||
        medicine.category === categoryFilter

      let matchesStock = true

      if (stockFilter === "in-stock") {
        matchesStock = totalStock > (reorderLevel || 0)
      }

      if (stockFilter === "low-stock") {
        matchesStock =
          totalStock > 0 && totalStock <= (reorderLevel || 0)
      }

      if (stockFilter === "out-of-stock") {
        matchesStock = totalStock === 0
      }

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [medicines, search, categoryFilter, stockFilter])

  const getTotalStock = (medicine) => {
    return medicine.batches.reduce(
      (sum, batch) => sum + Number(batch.stock || 0),
      0
    )
  }

  const getLowestReorderLevel = (medicine) => {
    if (!medicine.batches.length) return 0

    return Math.min(
      ...medicine.batches.map((batch) =>
        Number(batch.reorderLevel || 0)
      )
    )
  }

  const getStockStatus = (medicine) => {
    const stock = getTotalStock(medicine)
    const reorder = getLowestReorderLevel(medicine)

    if (stock === 0) {
      return {
        label: "Out of Stock",
        className: "text-red-600 bg-red-50",
        icon: XCircle,
      }
    }

    if (stock <= reorder) {
      return {
        label: "Low Stock",
        className: "text-amber-600 bg-amber-50",
        icon: AlertTriangle,
      }
    }

    return {
      label: "In Stock",
      className: "text-green-600 bg-green-50",
      icon: CheckCircle,
    }
  }

  const getFefoBatch = (medicine) => {
    const availableBatches = medicine.batches
      .filter((batch) => Number(batch.stock) > 0)
      .sort(
        (a, b) =>
          new Date(a.expiry).getTime() -
          new Date(b.expiry).getTime()
      )

    return availableBatches[0] || null
  }

  const getNextExpiry = (medicine) => {
    const batch = getFefoBatch(medicine)
    return batch?.expiry || "-"
  }

  const formatDate = (date) => {
    if (!date) return "-"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return date

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const resetMedicineModal = () => {
    setShowMedicineModal(false)
    setEditingMedicine(null)
  }

  const handleAdd = () => {
    setEditingMedicine(null)
    setShowMedicineModal(true)
  }

  const handleEdit = (medicine) => {
    setEditingMedicine({
      ...medicine,
      batches: medicine.batches.map((batch) => ({ ...batch })),
    })

    setShowMedicineModal(true)
  }

  const handleView = (medicine) => {
    setViewingMedicine(medicine)
    setShowViewModal(true)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine and all its batches?"
    )

    if (!confirmed) return

    setMedicines((current) =>
      current.filter((medicine) => medicine.id !== id)
    )
  }

  const handleSaveMedicine = (medicineData) => {
    if (editingMedicine) {
      setMedicines((current) =>
        current.map((medicine) =>
          medicine.id === editingMedicine.id
            ? {
                ...medicine,
                ...medicineData,
                id: editingMedicine.id,
              }
            : medicine
        )
      )
    } else {
      setMedicines((current) => [
        ...current,
        {
          id: Date.now(),
          ...medicineData,
        },
      ])
    }

    resetMedicineModal()
  }

  const normalizeHeader = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "")
  }

  const findColumn = (row, possibleNames) => {
    const keys = Object.keys(row)

    const normalizedNames = possibleNames.map(normalizeHeader)

    const matchingKey = keys.find((key) =>
      normalizedNames.includes(normalizeHeader(key))
    )

    return matchingKey ? row[matchingKey] : ""
  }

  const normalizeImportedRow = (row, rowNumber) => {
    const medicineName = String(
      findColumn(row, [
        "Medicine Name",
        "Medicine",
        "Product Name",
        "Product",
        "Name",
      ])
    ).trim()

    const manufacturer = String(
      findColumn(row, [
        "Manufacturer",
        "Company",
        "Manufacturer Name",
      ])
    ).trim()

    const category = String(
      findColumn(row, ["Category", "Type"])
    ).trim()

    const batchNumber = String(
      findColumn(row, [
        "Batch Number",
        "Batch No",
        "Batch",
        "BatchNumber",
      ])
    ).trim()

    const quantityValue = findColumn(row, [
      "Quantity",
      "Stock",
      "Available Stock",
    ])

    const reorderValue = findColumn(row, [
      "Reorder Level",
      "Reorder",
      "Minimum Stock",
    ])

    const mrpValue = findColumn(row, [
      "MRP",
      "Maximum Retail Price",
    ])

    const sellingPriceValue = findColumn(row, [
      "Selling Price",
      "Distributor Selling Price",
      "Price",
      "SellingPrice",
    ])

    const expiry = String(
      findColumn(row, [
        "Expiry Date",
        "Expiry",
        "ExpiryDate",
      ])
    ).trim()

    const unit = String(
      findColumn(row, ["Unit", "Pack Unit"])
    ).trim()

    const quantity = Number(quantityValue)
    const reorderLevel = Number(reorderValue)
    const mrp = Number(mrpValue)
    const sellingPrice = Number(sellingPriceValue)

    const errors = []

    if (!medicineName) {
      errors.push("Medicine name is missing")
    }

    if (!manufacturer) {
      errors.push("Manufacturer is missing")
    }

    if (!batchNumber) {
      errors.push("Batch number is missing")
    }

    if (!expiry) {
      errors.push("Expiry date is missing")
    }

    if (quantityValue === "" || Number.isNaN(quantity)) {
      errors.push("Quantity is invalid")
    }

    if (reorderValue === "" || Number.isNaN(reorderLevel)) {
      errors.push("Reorder level is invalid")
    }

    if (mrpValue === "" || Number.isNaN(mrp)) {
      errors.push("MRP is invalid")
    }

    if (
      sellingPriceValue === "" ||
      Number.isNaN(sellingPrice)
    ) {
      errors.push("Selling price is invalid")
    }

    return {
      rowNumber,
      medicineName,
      manufacturer,
      category: categories.includes(category)
        ? category
        : category || "Other",
      batchNumber,
      stock: quantity,
      reorderLevel,
      mrp,
      sellingPrice,
      expiry,
      unit: unit || "Unit",
      errors,
    }
  }

  const parseSpreadsheet = async (file) => {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, {
      type: "array",
      cellDates: true,
    })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json(firstSheet, {
      defval: "",
      raw: false,
    })

    return rows.map((row, index) =>
      normalizeImportedRow(row, index + 2)
    )
  }

  const parseCsv = async (file) => {
    const text = await file.text()

    const workbook = XLSX.read(text, {
      type: "string",
      raw: false,
    })

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json(firstSheet, {
      defval: "",
      raw: false,
    })

    return rows.map((row, index) =>
      normalizeImportedRow(row, index + 2)
    )
  }

  const groupPdfTextIntoRows = (items) => {
    const rows = {}

    items.forEach((item) => {
      const text = String(item.str || "").trim()

      if (!text) return

      const y = Math.round(item.transform[5])
      const x = item.transform[4]

      if (!rows[y]) {
        rows[y] = []
      }

      rows[y].push({
        text,
        x,
      })
    })

    return Object.keys(rows)
      .sort((a, b) => Number(b) - Number(a))
      .map((y) =>
        rows[y]
          .sort((a, b) => a.x - b.x)
          .map((item) => item.text)
      )
  }

  const parsePdf = async (file) => {
    const buffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({
      data: buffer,
    }).promise

    const allRows = []

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()

      const rows = groupPdfTextIntoRows(content.items)

      rows.forEach((row) => {
        if (row.length > 0) {
          allRows.push(row)
        }
      })
    }

    if (allRows.length < 2) {
      throw new Error("No readable table data was found in the PDF.")
    }

    const headerIndex = allRows.findIndex((row) =>
      row.some((cell) =>
        ["medicine", "medicine name", "product", "product name"].includes(
          cell.toLowerCase().trim()
        )
      )
    )

    if (headerIndex === -1) {
      throw new Error(
        "PDF header could not be detected. Use the required column format."
      )
    }

    const headers = allRows[headerIndex]

    const dataRows = allRows.slice(headerIndex + 1)

    const objects = dataRows
      .filter((row) => row.length >= 3)
      .map((row) => {
        const object = {}

        headers.forEach((header, index) => {
          object[header] = row[index] || ""
        })

        return object
      })

    return objects.map((row, index) =>
      normalizeImportedRow(row, index + headerIndex + 2)
    )
  }

  const validateImportedRows = (rows) => {
    const errors = []
    const duplicates = []

    const existingBatches = new Set()

    medicines.forEach((medicine) => {
      medicine.batches.forEach((batch) => {
        existingBatches.add(
          `${medicine.name.toLowerCase()}|${batch.batchNumber.toLowerCase()}`
        )
      })
    })

    const importedBatches = new Set()

    rows.forEach((row) => {
      if (row.errors.length > 0) {
        errors.push({
          rowNumber: row.rowNumber,
          messages: row.errors,
        })
        return
      }

      const key = `${row.medicineName.toLowerCase()}|${row.batchNumber.toLowerCase()}`

      if (existingBatches.has(key)) {
        duplicates.push({
          rowNumber: row.rowNumber,
          message: `${row.medicineName} - Batch ${row.batchNumber} already exists.`,
        })
      }

      if (importedBatches.has(key)) {
        duplicates.push({
          rowNumber: row.rowNumber,
          message: `${row.medicineName} - Batch ${row.batchNumber} is duplicated in the import file.`,
        })
      }

      importedBatches.add(key)
    })

    return {
      errors,
      duplicates,
    }
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    setImportLoading(true)
    setImportFileName(file.name)
    setImportRows([])
    setImportErrors([])
    setImportDuplicates([])

    try {
      const extension = file.name
        .split(".")
        .pop()
        .toLowerCase()

      let rows = []

      if (extension === "csv") {
        rows = await parseCsv(file)
      } else if (extension === "xlsx" || extension === "xls") {
        rows = await parseSpreadsheet(file)
      } else if (extension === "pdf") {
        rows = await parsePdf(file)
      } else {
        throw new Error(
          "Unsupported file type. Please use CSV, Excel, or PDF."
        )
      }

      const validation = validateImportedRows(rows)

      setImportRows(rows)
      setImportErrors(validation.errors)
      setImportDuplicates(validation.duplicates)
    } catch (error) {
      setImportErrors([
        {
          rowNumber: "-",
          messages: [error.message || "Unable to read this file."],
        },
      ])
    } finally {
      setImportLoading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const closeImportModal = () => {
    setShowImportModal(false)
    setImportRows([])
    setImportErrors([])
    setImportDuplicates([])
    setImportFileName("")
  }

  const confirmImport = () => {
    const invalidRows = new Set(
      importErrors.map((error) => error.rowNumber)
    )

    const duplicateRows = new Set(
      importDuplicates.map((duplicate) => duplicate.rowNumber)
    )

    const validRows = importRows.filter(
      (row) =>
        !invalidRows.has(row.rowNumber) &&
        !duplicateRows.has(row.rowNumber)
    )

    if (!validRows.length) {
      window.alert("There are no valid rows to import.")
      return
    }

    setMedicines((currentMedicines) => {
      const updatedMedicines = currentMedicines.map((medicine) => ({
        ...medicine,
        batches: medicine.batches.map((batch) => ({ ...batch })),
      }))

      validRows.forEach((row) => {
        const medicineIndex = updatedMedicines.findIndex(
          (medicine) =>
            medicine.name.toLowerCase() ===
              row.medicineName.toLowerCase() &&
            medicine.manufacturer.toLowerCase() ===
              row.manufacturer.toLowerCase()
        )

        const newBatch = {
          id: `${row.batchNumber}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 7)}`,
          batchNumber: row.batchNumber,
          stock: row.stock,
          reorderLevel: row.reorderLevel,
          mrp: row.mrp,
          sellingPrice: row.sellingPrice,
          expiry: row.expiry,
        }

        if (medicineIndex === -1) {
          updatedMedicines.push({
            id: Date.now() + Math.random(),
            name: row.medicineName,
            manufacturer: row.manufacturer,
            category: row.category,
            unit: row.unit,
            batches: [newBatch],
          })
        } else {
          updatedMedicines[medicineIndex].batches.push(newBatch)
        }
      })

      return updatedMedicines
    })

    window.alert(
      `${validRows.length} batch${validRows.length > 1 ? "es" : ""} imported successfully.`
    )

    closeImportModal()
  }

  const totalMedicines = medicines.length

  const totalStock = medicines.reduce(
    (total, medicine) => total + getTotalStock(medicine),
    0
  )

  const lowStock = medicines.filter((medicine) => {
    const stock = getTotalStock(medicine)
    const reorder = getLowestReorderLevel(medicine)

    return stock > 0 && stock <= reorder
  }).length

  const outOfStock = medicines.filter(
    (medicine) => getTotalStock(medicine) === 0
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text-primary">
            Catalog & Stock
          </h1>

          <p className="mt-1 text-sm theme-text-secondary">
            Manage medicines, batches, pricing and distributor stock.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 border theme-border theme-card theme-text-primary rounded-lg text-sm font-medium hover:border-[#159A9C] transition"
          >
            <Upload size={18} />
            Import
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#159A9C] text-white rounded-lg text-sm font-medium hover:bg-[#128486] transition"
          >
            <Plus size={18} />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <SummaryCard
          title="Total Medicines"
          value={totalMedicines}
          icon={Package}
        />

        <SummaryCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={Package}
        />

        <SummaryCard
          title="Low Stock"
          value={lowStock}
          icon={AlertTriangle}
          iconClass="text-amber-600 bg-amber-50"
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStock}
          icon={XCircle}
          iconClass="text-red-600 bg-red-50"
        />
      </div>

      {/* Filters */}
      <div className="theme-card border theme-border rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-secondary"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search medicine, manufacturer or batch..."
              className="w-full pl-10 pr-4 py-2.5 theme-input border theme-border rounded-lg text-sm focus:outline-none focus:border-[#159A9C]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full px-4 py-2.5 theme-input border theme-border rounded-lg text-sm focus:outline-none focus:border-[#159A9C]"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="w-full px-4 py-2.5 theme-input border theme-border rounded-lg text-sm focus:outline-none focus:border-[#159A9C]"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Medicine Table */}
      <div className="theme-card border theme-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b theme-border">
                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Medicine
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Batches
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Total Stock
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  MRP
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Selling Price
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Next Expiry
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold theme-text-secondary uppercase">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold theme-text-secondary uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.map((medicine) => {
                const status = getStockStatus(medicine)
                const StatusIcon = status.icon
                const fefoBatch = getFefoBatch(medicine)
                const firstBatch = medicine.batches[0]

                return (
                  <tr
                    key={medicine.id}
                    className="border-b theme-border last:border-b-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold theme-text-primary">
                          {medicine.name}
                        </p>

                        <p className="text-xs theme-text-secondary mt-1">
                          {medicine.manufacturer} • {medicine.category}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleView(medicine)}
                        className="flex items-center gap-2 text-sm text-[#159A9C] font-medium hover:underline"
                      >
                        {medicine.batches.length}{" "}
                        {medicine.batches.length === 1
                          ? "Batch"
                          : "Batches"}
                        <Eye size={15} />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold theme-text-primary">
                        {getTotalStock(medicine).toLocaleString()}
                      </p>

                      <p className="text-xs theme-text-secondary mt-1">
                        {medicine.unit || "Unit"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm theme-text-primary">
                      ₹{Number(firstBatch?.mrp || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-sm theme-text-primary">
                      ₹{Number(firstBatch?.sellingPrice || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays
                          size={15}
                          className="theme-text-secondary"
                        />

                        <div>
                          <p className="text-sm theme-text-primary">
                            {formatDate(getNextExpiry(medicine))}
                          </p>

                          {fefoBatch && (
                            <p className="text-xs text-[#159A9C] mt-1">
                              FEFO: {fefoBatch.batchNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                      >
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(medicine)}
                          className="p-2 rounded-lg theme-text-secondary hover:bg-[#159A9C]/10 hover:text-[#159A9C] transition"
                          title="View batches"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => handleEdit(medicine)}
                          className="p-2 rounded-lg theme-text-secondary hover:bg-[#159A9C]/10 hover:text-[#159A9C] transition"
                          title="Edit medicine"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(medicine.id)}
                          className="p-2 rounded-lg theme-text-secondary hover:bg-red-50 hover:text-red-600 transition"
                          title="Delete medicine"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredMedicines.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center theme-text-secondary"
                  >
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Medicine Modal */}
      {showMedicineModal && (
        <MedicineModal
          medicine={editingMedicine}
          categories={categories}
          onClose={resetMedicineModal}
          onSave={handleSaveMedicine}
        />
      )}

      {/* View Medicine Modal */}
      {showViewModal && viewingMedicine && (
        <ViewMedicineModal
          medicine={viewingMedicine}
          onClose={() => {
            setShowViewModal(false)
            setViewingMedicine(null)
          }}
          formatDate={formatDate}
          getFefoBatch={getFefoBatch}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          fileInputRef={fileInputRef}
          fileName={importFileName}
          rows={importRows}
          errors={importErrors}
          duplicates={importDuplicates}
          loading={importLoading}
          onFileChange={handleImportFile}
          onClose={closeImportModal}
          onImport={confirmImport}
        />
      )}
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconClass = "text-[#159A9C] bg-[#159A9C]/10",
}) {
  return (
    <div className="theme-card border theme-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm theme-text-secondary">{title}</p>

          <p className="text-2xl font-bold theme-text-primary mt-2">
            {value}
          </p>
        </div>

        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  )
}

function MedicineModal({
  medicine,
  categories,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    name: medicine?.name || "",
    manufacturer: medicine?.manufacturer || "",
    category: medicine?.category || "Tablets",
    unit: medicine?.unit || "Strip",
    batches:
      medicine?.batches?.length > 0
        ? medicine.batches.map((batch) => ({ ...batch }))
        : [
            {
              id: `new-${Date.now()}`,
              ...emptyBatch,
            },
          ],
  })

  const [expandedBatch, setExpandedBatch] = useState(0)

  const updateMedicineField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateBatch = (index, field, value) => {
    setForm((current) => ({
      ...current,
      batches: current.batches.map((batch, batchIndex) =>
        batchIndex === index
          ? {
              ...batch,
              [field]: value,
            }
          : batch
      ),
    }))
  }

  const addBatch = () => {
    setForm((current) => ({
      ...current,
      batches: [
        ...current.batches,
        {
          id: `new-${Date.now()}-${current.batches.length}`,
          ...emptyBatch,
        },
      ],
    }))

    setExpandedBatch(form.batches.length)
  }

  const removeBatch = (index) => {
    if (form.batches.length === 1) {
      window.alert("A medicine must have at least one batch.")
      return
    }

    setForm((current) => ({
      ...current,
      batches: current.batches.filter(
        (_, batchIndex) => batchIndex !== index
      ),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      window.alert("Medicine name is required.")
      return
    }

    if (!form.manufacturer.trim()) {
      window.alert("Manufacturer is required.")
      return
    }

    const cleanedBatches = form.batches.map((batch) => ({
      id:
        batch.id ||
        `batch-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
      batchNumber: String(batch.batchNumber).trim(),
      stock: Number(batch.stock),
      reorderLevel: Number(batch.reorderLevel),
      mrp: Number(batch.mrp),
      sellingPrice: Number(batch.sellingPrice),
      expiry: batch.expiry,
    }))

    const missingBatch = cleanedBatches.some(
      (batch) =>
        !batch.batchNumber ||
        Number.isNaN(batch.stock) ||
        Number.isNaN(batch.reorderLevel) ||
        Number.isNaN(batch.mrp) ||
        Number.isNaN(batch.sellingPrice) ||
        !batch.expiry
    )

    if (missingBatch) {
      window.alert(
        "Please complete all fields for every batch."
      )
      return
    }

    const duplicateBatchNumbers =
      cleanedBatches.length !==
      new Set(
        cleanedBatches.map((batch) =>
          batch.batchNumber.toLowerCase()
        )
      ).size

    if (duplicateBatchNumbers) {
      window.alert(
        "Duplicate batch numbers are not allowed for the same medicine."
      )
      return
    }

    onSave({
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      category: form.category,
      unit: form.unit,
      batches: cleanedBatches,
    })
  }

  return (
    <ModalOverlay>
      <div className="theme-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-5 border-b theme-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text-primary">
              {medicine ? "Edit Medicine" : "Add Medicine"}
            </h2>

            <p className="text-sm theme-text-secondary mt-1">
              Add medicine details and manage its batches.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg theme-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-145px)]"
        >
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold theme-text-primary mb-4">
                Medicine Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Medicine Name">
                  <input
                    value={form.name}
                    onChange={(event) =>
                      updateMedicineField(
                        "name",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Paracetamol 500mg"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField label="Manufacturer">
                  <input
                    value={form.manufacturer}
                    onChange={(event) =>
                      updateMedicineField(
                        "manufacturer",
                        event.target.value
                      )
                    }
                    placeholder="e.g. Cipla"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField label="Category">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateMedicineField(
                        "category",
                        event.target.value
                      )
                    }
                    className="form-input"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Unit">
                  <input
                    value={form.unit}
                    onChange={(event) =>
                      updateMedicineField(
                        "unit",
                        event.target.value
                      )
                    }
                    placeholder="Strip / Bottle / Box"
                    className="form-input"
                  />
                </FormField>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold theme-text-primary">
                    Batch Information
                  </h3>

                  <p className="text-xs theme-text-secondary mt-1">
                    Each batch has its own stock, expiry and pricing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addBatch}
                  className="flex items-center gap-2 px-3 py-2 bg-[#159A9C] text-white rounded-lg text-sm font-medium hover:bg-[#128486]"
                >
                  <Plus size={16} />
                  Add Batch
                </button>
              </div>

              <div className="space-y-3">
                {form.batches.map((batch, index) => {
                  const isExpanded = expandedBatch === index

                  return (
                    <div
                      key={batch.id || index}
                      className="border theme-border rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedBatch(
                            isExpanded ? -1 : index
                          )
                        }
                        className="w-full px-4 py-3 flex items-center justify-between theme-card"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-[#159A9C]/10 text-[#159A9C] flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>

                          <div className="text-left">
                            <p className="text-sm font-semibold theme-text-primary">
                              {batch.batchNumber ||
                                `Batch ${index + 1}`}
                            </p>

                            <p className="text-xs theme-text-secondary">
                              Stock:{" "}
                              {batch.stock === ""
                                ? "—"
                                : batch.stock}{" "}
                              • Expiry:{" "}
                              {batch.expiry || "Not set"}
                            </p>
                          </div>
                        </div>

                        {isExpanded ? (
                          <ChevronUp
                            size={18}
                            className="theme-text-secondary"
                          />
                        ) : (
                          <ChevronDown
                            size={18}
                            className="theme-text-secondary"
                          />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 border-t theme-border">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField label="Batch Number">
                              <input
                                value={batch.batchNumber}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "batchNumber",
                                    event.target.value
                                  )
                                }
                                placeholder="e.g. PCM26001"
                                className="form-input"
                                required
                              />
                            </FormField>

                            <FormField label="Available Stock">
                              <input
                                type="number"
                                min="0"
                                value={batch.stock}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "stock",
                                    event.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                            </FormField>

                            <FormField label="Reorder Level">
                              <input
                                type="number"
                                min="0"
                                value={batch.reorderLevel}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "reorderLevel",
                                    event.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                            </FormField>

                            <FormField label="MRP">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={batch.mrp}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "mrp",
                                    event.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                            </FormField>

                            <FormField label="Distributor Selling Price">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={batch.sellingPrice}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "sellingPrice",
                                    event.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                            </FormField>

                            <FormField label="Expiry Date">
                              <input
                                type="date"
                                value={batch.expiry}
                                onChange={(event) =>
                                  updateBatch(
                                    index,
                                    "expiry",
                                    event.target.value
                                  )
                                }
                                className="form-input"
                                required
                              />
                            </FormField>
                          </div>

                          <div className="flex justify-end mt-4">
                            <button
                              type="button"
                              onClick={() =>
                                removeBatch(index)
                              }
                              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={15} />
                              Remove Batch
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#159A9C]/5 border border-[#159A9C]/20">
              <div className="flex gap-3">
                <CheckCircle
                  size={18}
                  className="text-[#159A9C] mt-0.5"
                />

                <div>
                  <p className="text-sm font-semibold theme-text-primary">
                    FEFO batch handling
                  </p>

                  <p className="text-xs theme-text-secondary mt-1">
                    The batch with the earliest expiry and available
                    stock will be recommended first during pharmacy
                    billing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t theme-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border theme-border theme-text-primary rounded-lg text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#159A9C] text-white rounded-lg text-sm font-medium hover:bg-[#128486]"
            >
              {medicine ? "Save Changes" : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  )
}

function ViewMedicineModal({
  medicine,
  onClose,
  formatDate,
  getFefoBatch,
}) {
  const [expandedBatch, setExpandedBatch] = useState(null)

  const sortedBatches = [...medicine.batches].sort(
    (a, b) =>
      new Date(a.expiry).getTime() -
      new Date(b.expiry).getTime()
  )

  const fefoBatch = getFefoBatch(medicine)

  return (
    <ModalOverlay>
      <div className="theme-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-5 border-b theme-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text-primary">
              {medicine.name}
            </h2>

            <p className="text-sm theme-text-secondary mt-1">
              {medicine.manufacturer} • {medicine.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg theme-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-90px)] space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border theme-border">
              <p className="text-xs theme-text-secondary">
                Total Stock
              </p>

              <p className="text-xl font-bold theme-text-primary mt-1">
                {medicine.batches.reduce(
                  (sum, batch) =>
                    sum + Number(batch.stock || 0),
                  0
                )}
              </p>
            </div>

            <div className="p-4 rounded-xl border theme-border">
              <p className="text-xs theme-text-secondary">
                Total Batches
              </p>

              <p className="text-xl font-bold theme-text-primary mt-1">
                {medicine.batches.length}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#159A9C]/30 bg-[#159A9C]/5">
              <p className="text-xs theme-text-secondary">
                FEFO Recommended
              </p>

              <p className="text-sm font-bold text-[#159A9C] mt-1">
                {fefoBatch?.batchNumber || "No stock available"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold theme-text-primary mb-3">
              Batch Details
            </h3>

            <div className="space-y-3">
              {sortedBatches.map((batch) => {
                const isFefo =
                  fefoBatch?.id === batch.id

                const isExpanded =
                  expandedBatch === batch.id

                return (
                  <div
                    key={batch.id}
                    className={`border rounded-xl overflow-hidden ${
                      isFefo
                        ? "border-[#159A9C]/40"
                        : "theme-border"
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedBatch(
                          isExpanded ? null : batch.id
                        )
                      }
                      className="w-full px-4 py-4 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold theme-text-primary">
                            {batch.batchNumber}
                          </p>

                          <p className="text-xs theme-text-secondary mt-1">
                            Stock: {batch.stock} • Expiry:{" "}
                            {formatDate(batch.expiry)}
                          </p>
                        </div>

                        {isFefo && (
                          <span className="px-2 py-1 rounded-full bg-[#159A9C]/10 text-[#159A9C] text-xs font-medium">
                            FEFO
                          </span>
                        )}
                      </div>

                      {isExpanded ? (
                        <ChevronUp
                          size={18}
                          className="theme-text-secondary"
                        />
                      ) : (
                        <ChevronDown
                          size={18}
                          className="theme-text-secondary"
                        />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <InfoBox
                            label="Stock"
                            value={batch.stock}
                          />

                          <InfoBox
                            label="Reorder Level"
                            value={batch.reorderLevel}
                          />

                          <InfoBox
                            label="MRP"
                            value={`₹${Number(
                              batch.mrp
                            ).toFixed(2)}`}
                          />

                          <InfoBox
                            label="Selling Price"
                            value={`₹${Number(
                              batch.sellingPrice
                            ).toFixed(2)}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}

function ImportModal({
  fileInputRef,
  fileName,
  rows,
  errors,
  duplicates,
  loading,
  onFileChange,
  onClose,
  onImport,
}) {
  const validRows = rows.filter(
    (row) =>
      row.errors.length === 0 &&
      !duplicates.some(
        (duplicate) => duplicate.rowNumber === row.rowNumber
      )
  )

  return (
    <ModalOverlay>
      <div className="theme-card rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-5 border-b theme-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text-primary">
              Import Catalog
            </h2>

            <p className="text-sm theme-text-secondary mt-1">
              Import medicines and batches from CSV, Excel or PDF.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg theme-text-secondary hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-155px)] space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImportFormat
              icon={FileText}
              title="CSV"
              description="Comma-separated medicine data"
            />

            <ImportFormat
              icon={FileSpreadsheet}
              title="Excel"
              description=".xlsx or .xls files"
            />

            <ImportFormat
              icon={FileText}
              title="PDF"
              description="Table-based PDF data"
            />
          </div>

          <div className="border-2 border-dashed theme-border rounded-xl p-8 text-center">
            <Upload
              size={32}
              className="mx-auto text-[#159A9C]"
            />

            <p className="mt-3 font-semibold theme-text-primary">
              {fileName
                ? fileName
                : "Select your catalog file"}
            </p>

            <p className="text-sm theme-text-secondary mt-1">
              Supported formats: CSV, XLSX, XLS, PDF
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={onFileChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-5 py-2.5 bg-[#159A9C] text-white rounded-lg text-sm font-medium hover:bg-[#128486]"
            >
              Choose File
            </button>

            {loading && (
              <p className="text-sm text-[#159A9C] mt-3">
                Reading and validating file...
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#159A9C]/5 border border-[#159A9C]/20">
            <p className="text-sm font-semibold theme-text-primary">
              Required columns
            </p>

            <p className="text-xs theme-text-secondary mt-2 leading-6">
              Medicine Name, Manufacturer, Category, Batch Number,
              Quantity, Reorder Level, MRP, Selling Price, Expiry Date
            </p>
          </div>

          {rows.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImportStat
                  label="Imported Rows"
                  value={rows.length}
                />

                <ImportStat
                  label="Valid"
                  value={validRows.length}
                  className="text-green-600"
                />

                <ImportStat
                  label="Duplicates"
                  value={duplicates.length}
                  className="text-amber-600"
                />

                <ImportStat
                  label="Errors"
                  value={errors.length}
                  className="text-red-600"
                />
              </div>

              {(errors.length > 0 ||
                duplicates.length > 0) && (
                <div className="space-y-3">
                  {errors.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                      <p className="text-sm font-semibold text-red-700">
                        Validation Errors
                      </p>

                      <div className="mt-2 space-y-1">
                        {errors.slice(0, 10).map((error, index) => (
                          <p
                            key={index}
                            className="text-xs text-red-600"
                          >
                            Row {error.rowNumber}:{" "}
                            {error.messages.join(", ")}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {duplicates.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <p className="text-sm font-semibold text-amber-700">
                        Duplicate Batches
                      </p>

                      <div className="mt-2 space-y-1">
                        {duplicates
                          .slice(0, 10)
                          .map((duplicate, index) => (
                            <p
                              key={index}
                              className="text-xs text-amber-700"
                            >
                              Row {duplicate.rowNumber}:{" "}
                              {duplicate.message}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="font-semibold theme-text-primary mb-3">
                  Import Preview
                </h3>

                <div className="border theme-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                      <thead>
                        <tr className="border-b theme-border">
                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Row
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Medicine
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Batch
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Quantity
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Reorder
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            MRP
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Expiry
                          </th>

                          <th className="px-4 py-3 text-left text-xs theme-text-secondary">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.slice(0, 50).map((row) => {
                          const hasError =
                            row.errors.length > 0

                          const hasDuplicate =
                            duplicates.some(
                              (duplicate) =>
                                duplicate.rowNumber ===
                                row.rowNumber
                            )

                          return (
                            <tr
                              key={row.rowNumber}
                              className="border-b theme-border last:border-0"
                            >
                              <td className="px-4 py-3 text-sm theme-text-secondary">
                                {row.rowNumber}
                              </td>

                              <td className="px-4 py-3 text-sm font-medium theme-text-primary">
                                {row.medicineName || "—"}
                              </td>

                              <td className="px-4 py-3 text-sm theme-text-primary">
                                {row.batchNumber || "—"}
                              </td>

                              <td className="px-4 py-3 text-sm theme-text-primary">
                                {row.stock}
                              </td>

                              <td className="px-4 py-3 text-sm theme-text-primary">
                                {row.reorderLevel}
                              </td>

                              <td className="px-4 py-3 text-sm theme-text-primary">
                                ₹{row.mrp}
                              </td>

                              <td className="px-4 py-3 text-sm theme-text-primary">
                                {row.expiry || "—"}
                              </td>

                              <td className="px-4 py-3">
                                {hasError ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                    Invalid
                                  </span>
                                ) : hasDuplicate ? (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600">
                                    Duplicate
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                    Valid
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {rows.length > 50 && (
                  <p className="text-xs theme-text-secondary mt-2">
                    Showing first 50 rows of {rows.length}.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t theme-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border theme-border theme-text-primary rounded-lg text-sm font-medium"
          >
            Cancel
          </button>

          <button
            onClick={onImport}
            disabled={!validRows.length || loading}
            className="px-5 py-2.5 bg-[#159A9C] text-white rounded-lg text-sm font-medium hover:bg-[#128486] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import {validRows.length > 0 ? validRows.length : ""} Valid Rows
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

function ImportFormat({ icon: Icon, title, description }) {
  return (
    <div className="p-4 border theme-border rounded-xl flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-[#159A9C]/10 text-[#159A9C] flex items-center justify-center">
        <Icon size={19} />
      </div>

      <div>
        <p className="text-sm font-semibold theme-text-primary">
          {title}
        </p>

        <p className="text-xs theme-text-secondary mt-1">
          {description}
        </p>
      </div>
    </div>
  )
}

function ImportStat({
  label,
  value,
  className = "theme-text-primary",
}) {
  return (
    <div className="p-4 border theme-border rounded-xl">
      <p className="text-xs theme-text-secondary">{label}</p>

      <p className={`text-xl font-bold mt-1 ${className}`}>
        {value}
      </p>
    </div>
  )
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg theme-input">
      <p className="text-xs theme-text-secondary">
        {label}
      </p>

      <p className="text-sm font-semibold theme-text-primary mt-1">
        {value}
      </p>
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium theme-text-primary mb-2">
        {label}
      </span>

      {children}
    </label>
  )
}

function ModalOverlay({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
      {children}
    </div>
  )
}

export default Catalog