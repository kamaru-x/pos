"use client";

import { useState } from "react";
import { User, Clock, CheckCircle2, DollarSign, Check, Eye } from "lucide-react";
import StatsCard from "@/components/StatsCard";


const page = () => {

    const orders = [
        {
        id: 1,
        product: "Wireless Headphones",
        category: "Electronics",
        store: "Store A",
        image: "https://img.freepik.com/free-vector/cardboard-box-with-exclamation-mark_1308-175877.jpg",
        location: "Bangalore",
        quantity: 2,
        price: 60,
        date: "Dec 12, 2024",
        },
        {
        id: 2,
        product: "CRM SaaS Subscription",
        category: "SaaS",
        store: "SaaS App",
        image: "https://img.freepik.com/free-vector/cardboard-box-with-exclamation-mark_1308-175877.jpg",
        location: "Dubai",
        quantity: 1,
        price: 49,
        date: "Dec 11, 2024",
        },
        {
        id: 3,
        product: "Luxury Apartment Lead",
        category: "Real Estate",
        store: "Realty Pro",
        image: "https://img.freepik.com/free-vector/cardboard-box-with-exclamation-mark_1308-175877.jpg",
        location: "Kochi",
        quantity: 1,
        price: 8500,
        date: "Dec 10, 2024",
        },
    ];

    const freelanceEnquiries = [
        {
        id: 1,
        date: "Dec 14, 2024",
        time: "10:30 AM",
        service: "Backend Development",
        company: "TechNova Pvt Ltd",
        contact: "+91 98765 43210",
        },
    ];

    const saasEnquiries = [
        {
        id: 1,
        date: "Dec 13, 2024",
        time: "4:15 PM",
        saas: "CRM Pro",
        company: "Growth Labs",
        contact: "+971 55 123 4567",
        },
    ];

    const propertyEnquiries = [
        {
        id: 1,
        date: "Dec 12, 2024",
        time: "2:00 PM",
        customer: "Rahul Menon",
        location: "Kochi",
        property: "Luxury Apartment",
        propertyLocation: "Kakkanad",
        contact: "+91 95678 12345",
        },
    ];

    return (
        <div>
            <div className="p-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <StatsCard icon={User} title="Total Leads" value={0} />
                    <StatsCard icon={Clock} title="In Progress" value={0} />
                    <StatsCard icon={CheckCircle2} title="Completed" value={0} />
                    <StatsCard icon={DollarSign} title="Total Revenue" value="$0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TODO SECTION */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 h-100 flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Todos
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {[
                            { title: "Follow up ecommerce leads", completed: false },
                            { title: "Prepare SaaS pricing update", completed: false },
                            { title: "Client payment reminder", completed: true },
                            { title: "Review real estate listings", completed: false },
                            { title: "Optimize AdSense pages", completed: true },
                        ].map((todo, index) => (
                            <div
                            key={index}
                            className={`border rounded-lg p-3 flex items-center justify-between ${
                                todo.completed
                                ? "bg-gray-50 border-gray-200"
                                : "bg-white border-gray-200"
                            }`}
                            >
                            <p
                                className={`text-sm ${
                                todo.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-800"
                                }`}
                            >
                                {todo.title}
                            </p>

                            {!todo.completed && (
                                <button className="p-1.5 rounded-md hover:bg-green-100 transition">
                                <Check className="h-4 w-4 text-green-600" />
                                </button>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* CHECKLIST SECTION */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 h-100 flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Daily Checklist
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                        {[
                            { title: "Check store sales", completed: true },
                            { title: "Respond to freelance messages", completed: false },
                            { title: "Review ad performance", completed: true },
                            { title: "Update CRM leads", completed: false },
                            { title: "Track SaaS subscriptions", completed: false },
                        ].map((item, index) => (
                            <div
                            key={index}
                            className={`border rounded-lg p-3 flex items-center justify-between ${
                                item.completed
                                ? "bg-green-50 border-green-200"
                                : "bg-white border-gray-200"
                            }`}
                            >
                            <p
                                className={`text-sm ${
                                item.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-800"
                                }`}
                            >
                                {item.title}
                            </p>

                            {!item.completed && (
                                <button className="p-1.5 rounded-md hover:bg-green-100 transition">
                                <Check className="h-4 w-4 text-green-600" />
                                </button>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Orders</h3>

                    <div className="space-y-4">
                        {orders.map((order, index) => {
                        const total = order.quantity * order.price;

                        return (
                            <div
                            key={order.id}
                            className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition"
                            >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                <span className="text-xs font-semibold text-gray-400">
                                Order #{index + 1}
                                </span>
                                <span className="text-xs text-gray-500">{order.date}</span>
                            </div>

                            {/* Main Content */}
                            <div className="grid lg:grid-cols-3 gap-4 mb-4">
                                {/* Product (NO BORDER) */}
                                <div className="flex items-center gap-4 p-3 rounded-lg">
                                    <img
                                    src={order.image}
                                    alt={order.product}
                                    className="h-20 w-20 rounded-lg object-cover border border-gray-200 p-2"
                                    />

                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                                        {order.product}
                                    </h4>
                                    <span className="inline-block w-fit px-2 py-0.5 rounded-full bg-gray-200 text-xs text-gray-600">
                                        {order.category}
                                    </span>
                                    </div>
                                </div>

                                {/* Details (GRAY-200 BORDER) */}
                                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 text-center">
  
                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs text-gray-500 block mb-1">Store</span>
                                        <span className="text-sm font-medium text-gray-900">{order.store}</span>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs text-gray-500 block mb-1">Location</span>
                                        <span className="text-sm text-gray-700">{order.location}</span>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs text-gray-500 block mb-1">Quantity</span>
                                        <span className="text-sm font-medium text-gray-900">{order.quantity}</span>
                                    </div>

                                    <div className="flex flex-col justify-center">
                                        <span className="text-xs text-gray-500 block mb-1">Price</span>
                                        <span className="text-sm text-gray-700">
                                        ${order.price.toLocaleString()}
                                        </span>
                                    </div>

                                </div>

                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div>
                                <span className="text-xs text-gray-500 block mb-0.5">
                                    Total Amount
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                    ${total.toLocaleString()}
                                </span>
                                </div>

                                <button
                                className="text-xs font-medium px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition"
                                >
                                View Details
                                </button>
                            </div>
                            </div>
                        );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page