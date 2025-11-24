import React from 'react'
import { Menu, X, Search, Bell, User } from "lucide-react";

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30">
            <div className="h-full px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-xl font-semibold text-gray-800">POS System</h1>
                </div>

                <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
                    <Search size={18} className="text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-sm w-full"
                    />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell size={20} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <User size={20} className="text-gray-600" />
                </button>
                </div>
            </div>
        </header>
    )
}

export default Header