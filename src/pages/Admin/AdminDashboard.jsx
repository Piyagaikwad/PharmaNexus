import {
  LayoutDashboard,
  Building2,
  Truck,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

function Admin({ onNavigate }) {
  const stats = [
    {
      title: "Total Pharmacies",
      value: null,
      icon: Building2,
    },
    {
      title: "Total Distributors",
      value: null,
      icon: Truck,
    },
    {
      title: "Total Users",
      value: null,
      icon: Users,
    },
    {
      title: "Pending Approvals",
      value: null,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#0F2742]">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage pharmacies, distributors and users.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <h2 className="mt-2 text-2xl font-semibold text-[#0F2742]">
                    {stat.value ?? "—"}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F7F7]">
                  <Icon size={21} className="text-[#159A9C]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Management Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-[#0F2742]">
          Management
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Pharmacies */}
          <button
            onClick={() => onNavigate?.("admin-pharmacies")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#159A9C] hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F7F7]">
              <Building2 size={21} className="text-[#159A9C]" />
            </div>

            <h3 className="mt-4 font-semibold text-[#0F2742]">
              Pharmacies
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered pharmacies.
            </p>
          </button>

          {/* Distributors */}
          <button
            onClick={() => onNavigate?.("admin-distributors")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#159A9C] hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F7F7]">
              <Truck size={21} className="text-[#159A9C]" />
            </div>

            <h3 className="mt-4 font-semibold text-[#0F2742]">
              Distributors
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage registered distributors.
            </p>
          </button>

          {/* Users */}
          <button
            onClick={() => onNavigate?.("admin-users")}
            className="rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-[#159A9C] hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E8F7F7]">
              <Users size={21} className="text-[#159A9C]" />
            </div>

            <h3 className="mt-4 font-semibold text-[#0F2742]">
              Users
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View registered users and their roles.
            </p>
          </button>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <div>
            <h2 className="font-semibold text-[#0F2742]">
              Pending Approvals
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              New pharmacy and distributor registrations requiring review.
            </p>
          </div>

          <Clock size={20} className="text-gray-400" />
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <CheckCircle size={22} className="text-gray-400" />
          </div>

          <h3 className="mt-3 font-medium text-[#0F2742]">
            No pending approvals
          </h3>

          <p className="mt-1 max-w-md text-sm text-gray-500">
            Pending registration requests will appear here once data is
            connected to the backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;