import {
  Package,
  Boxes,
  ShoppingCart,
  Store,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h3 className="text-2xl font-bold text-[#0F2742] mt-2">
          {value}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="w-11 h-11 rounded-lg bg-[#E8F7F7] flex items-center justify-center">
        <Icon
          size={22}
          className="text-[#159A9C]"
        />
      </div>
    </div>
  );
}

function Dashboard() {
  const recentOrders = [
    {
      id: "ORD-1024",
      pharmacy: "Apollo Pharmacy",
      items: 12,
      amount: "₹8,450",
      status: "Pending",
    },
    {
      id: "ORD-1023",
      pharmacy: "MedPlus Pharmacy",
      items: 8,
      amount: "₹4,200",
      status: "Approved",
    },
    {
      id: "ORD-1022",
      pharmacy: "City Medical Store",
      items: 20,
      amount: "₹12,600",
      status: "Shipped",
    },
    {
      id: "ORD-1021",
      pharmacy: "HealthCare Pharmacy",
      items: 6,
      amount: "₹3,750",
      status: "Delivered",
    },
  ];

  const lowStockMedicines = [
    {
      name: "Amoxicillin 500mg",
      batch: "AM25012",
      stock: 12,
      reorder: 30,
    },
    {
      name: "Azithromycin 500mg",
      batch: "AZ26003",
      stock: 18,
      reorder: 40,
    },
    {
      name: "Cefixime 200mg",
      batch: "CF25008",
      stock: 9,
      reorder: 25,
    },
  ];

  const pharmacies = [
    {
      name: "Apollo Pharmacy",
      location: "Pune",
      orders: 42,
      status: "Active",
    },
    {
      name: "City Medical Store",
      location: "Mumbai",
      orders: 18,
      status: "Active",
    },
    {
      name: "HealthCare Pharmacy",
      location: "Nashik",
      orders: 27,
      status: "Active",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700";

      case "Approved":
        return "bg-blue-50 text-blue-700";

      case "Shipped":
        return "bg-purple-50 text-purple-700";

      case "Delivered":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>
        <h1 className="text-2xl font-bold text-[#0F2742]">
          Distributor Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Overview of your inventory, orders and connected pharmacies.
        </p>
      </div>


      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Medicines"
          value="1,248"
          subtitle="Medicines in catalog"
          icon={Package}
        />

        <StatCard
          title="Total Stock"
          value="45,620"
          subtitle="Units currently available"
          icon={Boxes}
        />

        <StatCard
          title="Pending Orders"
          value="18"
          subtitle="Orders waiting for action"
          icon={ShoppingCart}
        />

        <StatCard
          title="Connected Pharmacies"
          value="32"
          subtitle="Active pharmacy connections"
          icon={Store}
        />

      </div>


      {/* Main Dashboard Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">


        {/* Recent Orders */}

        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

            <div>
              <h2 className="text-lg font-semibold text-[#0F2742]">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest orders received from pharmacies.
              </p>
            </div>

            <button className="text-sm font-medium text-[#159A9C] hover:underline">
              View All
            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">

                  <th className="px-6 py-4 font-medium">
                    Order ID
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Pharmacy
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Items
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Amount
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="px-6 py-4 text-sm font-medium text-[#0F2742]">
                      {order.id}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.pharmacy}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {order.amount}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* Low Stock */}

        <div className="bg-white rounded-xl border border-gray-200">

          <div className="px-6 py-5 border-b border-gray-200">

            <div className="flex items-center gap-2">

              <AlertTriangle
                size={19}
                className="text-orange-500"
              />

              <h2 className="text-lg font-semibold text-[#0F2742]">
                Low Stock
              </h2>

            </div>

            <p className="text-sm text-gray-500 mt-1">
              Medicines that need restocking.
            </p>

          </div>


          <div className="p-5 space-y-4">

            {lowStockMedicines.map((medicine) => (

              <div
                key={medicine.batch}
                className="p-4 rounded-lg bg-gray-50 border border-gray-100"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-semibold text-[#0F2742]">
                      {medicine.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Batch: {medicine.batch}
                    </p>

                  </div>

                  <span className="text-xs font-semibold text-orange-600">
                    {medicine.stock} left
                  </span>

                </div>

                <div className="mt-3">

                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-orange-400 rounded-full"
                      style={{
                        width: `${Math.min(
                          (medicine.stock / medicine.reorder) * 100,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Reorder level: {medicine.reorder}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* Connected Pharmacies */}

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

          <div>

            <h2 className="text-lg font-semibold text-[#0F2742]">
              Connected Pharmacies
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pharmacies currently connected with your business.
            </p>

          </div>

          <button className="text-sm font-medium text-[#159A9C] hover:underline">
            View All
          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>

              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">

                <th className="px-6 py-4 font-medium">
                  Pharmacy
                </th>

                <th className="px-6 py-4 font-medium">
                  Location
                </th>

                <th className="px-6 py-4 font-medium">
                  Total Orders
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {pharmacies.map((pharmacy) => (

                <tr
                  key={pharmacy.name}
                  className="border-b border-gray-100 last:border-0"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-[#E8F7F7] flex items-center justify-center">

                        <Store
                          size={18}
                          className="text-[#159A9C]"
                        />

                      </div>

                      <span className="text-sm font-medium text-[#0F2742]">
                        {pharmacy.name}
                      </span>

                    </div>

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pharmacy.location}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pharmacy.orders}
                  </td>

                  <td className="px-6 py-4">

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">

                      <CheckCircle size={13} />

                      {pharmacy.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Quick Overview */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">

          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">

            <Clock
              size={21}
              className="text-blue-600"
            />

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Orders Awaiting Action
            </p>

            <p className="text-xl font-bold text-[#0F2742] mt-1">
              18 Orders
            </p>

          </div>

        </div>


        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">

          <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">

            <Truck
              size={21}
              className="text-green-600"
            />

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Orders In Transit
            </p>

            <p className="text-xl font-bold text-[#0F2742] mt-1">
              7 Orders
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;