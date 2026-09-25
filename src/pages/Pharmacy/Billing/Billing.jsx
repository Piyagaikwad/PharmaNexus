import { useState } from 'react'
import {
  Search,
  ShoppingCart,
  User,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react'

function Billing({ medicines, setMedicines, setCurrentInvoice, setCurrentPage, }) {

  // Search and cart
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])

  // Customer details
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Discount
  const [discount, setDiscount] = useState(0)

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [showPayment, setShowPayment] = useState(false)

  // Filter medicines from shared Inventory data
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  )

  // Add medicine to cart
  const addToCart = (medicine) => {

    if (medicine.stock <= 0) return

    const existingMedicine = cart.find(
      (item) => item.batch === medicine.batch
    )

    if (existingMedicine) {

      if (existingMedicine.quantity >= medicine.stock) {
        return
      }

      setCart(
        cart.map((item) =>
          item.batch === medicine.batch
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      )

      return
    }

    setCart([
      ...cart,
      {
        ...medicine,
        quantity: 1,
        unitPrice: Number(medicine.price),
      },
    ])
  }

  // Increase medicine quantity
  const increaseQuantity = (batch) => {

    setCart(
      cart.map((item) => {

        if (item.batch !== batch) {
          return item
        }

        const medicine = medicines.find(
          (medicine) => medicine.batch === batch
        )

        if (!medicine || item.quantity >= medicine.stock) {
          return item
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        }
      })
    )
  }

  // Decrease medicine quantity
  const decreaseQuantity = (batch) => {

    setCart(
      cart
        .map((item) =>
          item.batch === batch
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  // Remove medicine from cart
  const removeFromCart = (batch) => {

    setCart(
      cart.filter((item) => item.batch !== batch)
    )
  }

  // Bill calculations
  const subtotal = cart.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  )

  const safeDiscount = Math.min(
    Math.max(Number(discount) || 0, 0),
    subtotal
  )

  const taxableAmount = Math.max(
    subtotal - safeDiscount,
    0
  )

  const gst = taxableAmount * 0.05

  const grandTotal = taxableAmount + gst

  // Complete sale and update Inventory
  const completeSale = () => {

    if (cart.length === 0) return

    // Check stock again before completing payment
    const stockChanged = cart.some((item) => {

      const medicine = medicines.find(
        (medicine) => medicine.batch === item.batch
      )

      return (
        !medicine ||
        item.quantity > medicine.stock
      )
    })

    if (stockChanged) {
      alert(
        'Some medicines no longer have enough stock. Please review the bill.'
      )

      setShowPayment(false)
      return
    }
  //Invoice 
    const invoiceData = {
  invoiceNumber: `INV-${Date.now()}`,
  date: new Date().toISOString(),
  pharmacyName: "Apollo Pharmacy",
  customerName,
  customerPhone,
  items: cart,
  subtotal,
  discount: safeDiscount,
  gst,
  grandTotal,
  paymentMethod,
}
    // Deduct sold quantity from shared Inventory
    setMedicines((currentMedicines) =>
      currentMedicines.map((medicine) => {

        const soldItem = cart.find(
          (item) => item.batch === medicine.batch
        )

        if (!soldItem) {
          return medicine
        }

        return {
          ...medicine,
          stock:
            medicine.stock - soldItem.quantity,
        }
      })
    )
    setCurrentInvoice(invoiceData)
    setCurrentPage("invoice")
    // Clear bill after successful payment
    setCart([])
    setCustomerName('')
    setCustomerPhone('')
    setDiscount(0)
    setPaymentMethod('Cash')
    setShowPayment(false)

    alert('Sale completed successfully!')
  }

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-2xl font-semibold theme-text-primary">
          Billing
        </h1>

        <p className="text-sm theme-text-secondary mt-1">
          Create bills and manage pharmacy sales
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Medicine Selection */}
        <div className="xl:col-span-2 theme-card rounded-xl p-6">

          <div className="flex items-center gap-2 mb-5">

            <ShoppingCart
              size={20}
              className="theme-primary"
            />

            <h2 className="text-lg font-semibold theme-text-primary">
              Add Medicines
            </h2>

          </div>

          {/* Search */}
          <div className="relative">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 theme-text-secondary"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicine by name..."
              className="theme-input w-full pl-10 pr-4 py-3 rounded-lg outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />

          </div>

          {/* Medicine List */}
          <div className="mt-5 border theme-border rounded-lg overflow-hidden">

            <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-[var(--bg-input)] theme-text-secondary text-xs font-medium">

              <span>Medicine</span>
              <span>Batch</span>
              <span>Stock</span>
              <span>Price</span>
              <span className="text-center">Action</span>

            </div>

            {filteredMedicines.length > 0 ? (

              <div className="divide-y divide-[var(--border)]">

                {filteredMedicines.map((medicine) => (

                  <div
                    key={medicine.batch}
                    className="grid grid-cols-5 gap-4 items-center px-4 py-4 hover:bg-[var(--bg-input)] transition"
                  >

                    {/* Medicine */}
                    <div>

                      <p className="text-sm font-medium theme-text-primary">
                        {medicine.name}
                      </p>

                      <p className="text-xs theme-text-secondary mt-0.5">
                        {medicine.category}
                      </p>

                    </div>

                    {/* Batch */}
                    <span className="text-sm theme-text-secondary">
                      {medicine.batch}
                    </span>

                    {/* Stock */}
                    <span
                      className={`text-sm font-medium ${
                        medicine.stock === 0
                          ? 'text-[var(--danger)]'
                          : medicine.stock <= medicine.reorder
                            ? 'text-[var(--warning)]'
                            : 'theme-text-primary'
                      }`}
                    >
                      {medicine.stock}
                    </span>

                    {/* Price */}
                    <span className="text-sm font-medium theme-text-primary">
                      ₹{Number(medicine.price).toFixed(2)}
                    </span>

                    {/* Add Button */}
                    <div className="flex justify-center">

                      <button
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock <= 0}
                        className={`flex items-center gap-1 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition ${
                          medicine.stock <= 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]'
                        }`}
                      >

                        <Plus size={14} />

                        {medicine.stock <= 0
                          ? 'Out'
                          : 'Add'}

                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="px-4 py-10 text-center">

                <p className="text-sm theme-text-secondary">
                  No medicines found
                </p>

              </div>

            )}

          </div>

        </div>

        {/* Current Bill */}
        <div className="theme-card rounded-xl p-6">

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">

              <ShoppingCart
                size={20}
                className="theme-primary"
              />

              <h2 className="text-lg font-semibold theme-text-primary">
                Current Bill
              </h2>

            </div>

            <span className="text-xs theme-text-secondary">
              {cart.length} items
            </span>

          </div>

          {/* Cart */}
          {cart.length > 0 ? (

            <div className="space-y-3">

              {cart.map((item) => (

                <div
                  key={item.batch}
                  className="border theme-border rounded-lg p-3"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium theme-text-primary">
                        {item.name}
                      </p>

                      <p className="text-xs theme-text-secondary mt-1">
                        Batch: {item.batch}
                      </p>

                      <p className="text-sm theme-text-primary mt-2">
                        ₹{item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.batch)
                      }
                      className="theme-text-secondary hover:text-[var(--danger)] transition"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-3">

                    <div className="flex items-center border theme-border rounded-lg">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.batch)
                        }
                        className="px-2 py-1 theme-text-secondary hover:bg-[var(--bg-input)]"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-3 text-sm theme-text-primary">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.batch)
                        }
                        className="px-2 py-1 theme-text-secondary hover:bg-[var(--bg-input)]"
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                    <span className="text-sm font-semibold theme-text-primary">
                      ₹{(
                        item.unitPrice * item.quantity
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="border theme-border rounded-lg">

              <div className="px-4 py-8 text-center">

                <ShoppingCart
                  size={32}
                  className="mx-auto theme-text-secondary"
                />

                <p className="text-sm font-medium theme-text-primary mt-3">
                  No medicines added
                </p>

                <p className="text-xs theme-text-secondary mt-1">
                  Add medicines to create a bill
                </p>

              </div>

            </div>

          )}

          {/* Customer Details */}
          <div className="mt-6">

            <div className="flex items-center gap-2 mb-3">

              <User
                size={18}
                className="theme-primary"
              />

              <h3 className="text-sm font-semibold theme-text-primary">
                Customer Details
              </h3>

            </div>

            <input
              type="text"
              value={customerName}
              onChange={(e) =>
                setCustomerName(e.target.value)
              }
              placeholder="Customer name (optional)"
              className="theme-input w-full px-4 py-2.5 rounded-lg outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />

            <input
              type="tel"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value)
              }
              placeholder="Mobile number (optional)"
              className="theme-input w-full px-4 py-2.5 rounded-lg mt-3 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
            />

          </div>

          {/* Bill Summary */}
          <div className="mt-6 pt-5 border-t theme-border space-y-3">

            <div className="flex justify-between text-sm">

              <span className="theme-text-secondary">
                Subtotal
              </span>

              <span className="theme-text-primary">
                ₹{subtotal.toFixed(2)}
              </span>

            </div>

            <div className="flex items-center justify-between text-sm">

              <span className="theme-text-secondary">
                Discount
              </span>

              <input
                type="number"
                min="0"
                max={subtotal}
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    Math.min(
                      Math.max(
                        Number(e.target.value) || 0,
                        0
                      ),
                      subtotal
                    )
                  )
                }
                className="theme-input w-24 px-2 py-1 rounded-md text-right outline-none"
              />

            </div>

            <div className="flex justify-between text-sm">

              <span className="theme-text-secondary">
                GST (5%)
              </span>

              <span className="theme-text-primary">
                ₹{gst.toFixed(2)}
              </span>

            </div>

            <div className="pt-3 border-t theme-border flex items-center justify-between">

              <span className="font-semibold theme-text-primary">
                Grand Total
              </span>

              <span className="text-lg font-bold theme-primary">
                ₹{grandTotal.toFixed(2)}
              </span>

            </div>

          </div>

          {/* Payment Button */}
          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.length === 0}
            className={`w-full mt-5 py-3 bg-[var(--primary)] text-white rounded-lg font-medium transition ${
              cart.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[var(--primary-hover)]'
            }`}
          >
            Proceed to Payment
          </button>

        </div>

      </div>

      {/* Payment Modal */}
      {showPayment && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="theme-card rounded-xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-semibold theme-text-primary">
              Complete Payment
            </h2>

            <p className="text-sm theme-text-secondary mt-1">
              Select payment method for this sale.
            </p>

            {/* Payment Methods */}
            <div className="mt-6 space-y-3">

              {['Cash', 'UPI', 'Card'].map((method) => (

                <button
                  key={method}
                  onClick={() =>
                    setPaymentMethod(method)
                  }
                  className={`w-full p-3 rounded-lg border text-left transition ${
                    paymentMethod === method
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                      : 'theme-border'
                  }`}
                >

                  <span className="theme-text-primary font-medium">
                    {method}
                  </span>

                </button>

              ))}

            </div>

            {/* Payment Amount */}
            <div className="mt-6 pt-4 border-t theme-border">

              <div className="flex justify-between">

                <span className="theme-text-secondary">
                  Amount to Pay
                </span>

                <span className="font-semibold theme-text-primary">
                  ₹{grandTotal.toFixed(2)}
                </span>

              </div>

            </div>

            {/* Modal Buttons */}
            <div className="flex gap-3 mt-6">

              <button
                onClick={() =>
                  setShowPayment(false)
                }
                className="flex-1 px-4 py-2.5 rounded-lg border theme-border theme-text-primary hover:bg-[var(--bg-input)] transition"
              >
                Cancel
              </button>

              <button
                onClick={completeSale}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition"
              >
                Complete Payment
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Billing