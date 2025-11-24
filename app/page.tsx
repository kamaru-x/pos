"use client";

import { useState } from "react";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  Search,
  Bell,
  User
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Sales", active: false },
    { icon: Package, label: "Products", active: false },
    { icon: Users, label: "Customers", active: false },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="p-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { label: "Total Sales", value: "$12,345", change: "+12.5%" },
          { label: "Orders", value: "234", change: "+8.2%" },
          { label: "Customers", value: "1,234", change: "+3.1%" },
          { label: "Revenue", value: "$45,678", change: "+15.3%" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{stat.value}</h3>
            <span className="text-sm text-green-600">{stat.change}</span>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + item}</p>
                  <p className="text-sm text-gray-500">Customer Name {item}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(Math.random() * 500 + 50).toFixed(2)}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              New Sale
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Add Product
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}