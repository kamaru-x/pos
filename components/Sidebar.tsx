"use client";

import {
  Home,
  ListChecks,
  ClipboardList,
  Building2,
  DollarSign,
  Dumbbell,
  Briefcase,
  Store,
  User,
  CreditCard,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

    const menuItems = [
        { icon: Home, label: "Dashboard", href: "/" },
        { icon: CreditCard, label: "Accounts", href: "/accounts" },
        { icon: User, label: "Freelance", href: "/freelance" },
        { icon: Briefcase, label: "SaaS", href: "/saas" },
        { icon: Store, label: "Stores", href: "/stores" },
        { icon: DollarSign, label: "Monetisation", href: "/monetisation" },
        { icon: Building2, label: "Properties", href: "/properties" },
        { icon: Dumbbell, label: "Fitness", href: "/fitness" },
        { icon: ClipboardList, label: "Checklist", href: "/checklist" },
        { icon: ListChecks, label: "Todos", href: "/todos" },
    ];

    const pathname = usePathname();

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-20 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <nav className="p-4 space-y-1">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={index}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
                </nav>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                className="fixed inset-0 bg-black/40 z-10 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                ></div>
            )}
            </>
    )
}

export default Sidebar