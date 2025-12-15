"use client";

import { useState } from "react";
import { Plus, Filter, Banknote, Layers3, BarChart3, ListChecks } from "lucide-react";
import {
  accounts as mockAccounts,
  categories as mockCategories,
  transactions as mockTransactions,
  businessEarnings,
} from "../../database";

const TABS = [
  { name: "Overview", icon: BarChart3 },
  { name: "Transactions", icon: ListChecks },
  { name: "Bank Accounts", icon: Banknote },
  { name: "Categories", icon: Layers3 },
];

const CATEGORY_COLORS = ["#6366F1", "#EC4899", "#F97316", "#0EA5E9", "#22C55E", "#A855F7", "#F43F5E", "#14B8A6"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const page = () => {
    const [activeTab, setActiveTab] = useState("Overview");
      const [showFilter, setShowFilter] = useState(false);
      const [showCreate, setShowCreate] = useState(false);
    
      // Dummy state (in-memory for demo)
      const [accounts, setAccounts] = useState([...mockAccounts]);
      const [categories, setCategories] = useState([...mockCategories]);
      const [transactions, setTransactions] = useState([...mockTransactions]);
    
      // Forms/demo state
      const [newAccount, setNewAccount] = useState({ accountName: "", bankName: "", balance: "" });
      const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
      const [newTxn, setNewTxn] = useState({ date: "", accountId: accounts[0]?.id || "", categoryId: categories[0]?.id || "", amount: "", note: "" });
      // Filtering
      const [filterCategory, setFilterCategory] = useState("");
      const [filterAccount, setFilterAccount] = useState("");
    
      const categoryStats = categories.map((cat, index) => {
        const catTransactions = transactions.filter(txn => txn.categoryId === cat.id);
        const spent = catTransactions.filter(txn => txn.amount < 0).reduce((sum, txn) => sum + Math.abs(txn.amount), 0);
        const earned = catTransactions.filter(txn => txn.amount > 0).reduce((sum, txn) => sum + txn.amount, 0);
        const totalAbs = spent + earned;
        return {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          spent,
          earned,
          totalAbs,
          color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        };
      });
    
      const totalCategoryValue = categoryStats.reduce((sum, stat) => sum + stat.totalAbs, 0);
      let pieBackground = "#E5E7EB";
      if (totalCategoryValue > 0) {
        let cumulative = 0;
        const segments: string[] = [];
        categoryStats.forEach(stat => {
          if (!stat.totalAbs) return;
          const start = (cumulative / totalCategoryValue) * 360;
          cumulative += stat.totalAbs;
          const end = (cumulative / totalCategoryValue) * 360;
          segments.push(`${stat.color} ${start}deg ${end}deg`);
        });
        pieBackground = `conic-gradient(${segments.join(", ")})`;
      }

    const monthlyStats = transactions.reduce((acc: any, txn: any) => {
    const monthKey = new Date(txn.date).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
    });

    if (!acc[monthKey]) {
        acc[monthKey] = { earned: 0, spent: 0 };
    }

    if (txn.amount > 0) {
        acc[monthKey].earned += txn.amount;
    } else {
        acc[monthKey].spent += Math.abs(txn.amount);
    }

    return acc;
    }, {});

    const monthlyReport = Object.entries(monthlyStats).map(([month, values]: any) => ({
        month,
        earned: values.earned,
        spent: values.spent,
    }));

    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterType, setFilterType] = useState(""); // income | expense

    const filteredTxns = transactions.filter(txn => {
        const txnDate = new Date(txn.date).getTime();

        const fromOk = !filterFromDate || txnDate >= new Date(filterFromDate).getTime();
        const toOk = !filterToDate || txnDate <= new Date(filterToDate).getTime();

        const typeOk =
            !filterType ||
            (filterType === "income" && txn.amount > 0) ||
            (filterType === "expense" && txn.amount < 0);

        return (
            (!filterAccount || txn.accountId === filterAccount) &&
            (!filterCategory || txn.categoryId === filterCategory) &&
            fromOk &&
            toOk &&
            typeOk
        );
    });

    return (
        <div>
            <div className="p-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {TABS.map((tab) => (
                        <button
                        key={tab.name}
                        onClick={() => {
                            setActiveTab(tab.name);
                            setShowFilter(false);
                            setShowCreate(false);
                        }}
                        className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all text-base whitespace-nowrap ${
                            activeTab === tab.name
                            ? "bg-gray-900 text-white shadow"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        >
                        <tab.icon size={18} /> {tab.name}
                        </button>
                    ))}
                    </div>
                </div>

                {activeTab === "Overview" && (
                    <div className="space-y-4">
                        <div className="rounded-lg border border-gray-200 p-4 bg-white">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Business Earnings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {businessEarnings.map((biz, idx) => (
                                <div key={biz.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{biz.name}</p>
                                    <p className="text-xs text-gray-500">{biz.trend} vs last month</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(biz.amount)}</p>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="rounded-lg border border-gray-200 p-4 bg-white flex flex-col">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">Category Spend vs Earn</h3>
                                <div className="space-y-4">
                                    {categoryStats.map((stat) => {
                                    const total = stat.spent + stat.earned || 1;
                                    const spentPerc = Math.round((stat.spent / total) * 100);
                                    const earnedPerc = Math.round((stat.earned / total) * 100);
                                    return (
                                        <div key={stat.id} className="p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 font-medium text-gray-900">
                                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stat.color }}></span>
                                            {stat.name}
                                            </span>
                                            <span className="text-gray-500">{formatCurrency(stat.earned - stat.spent)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs mt-2 flex-wrap">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-700">
                                            Spent {formatCurrency(stat.spent)}
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700">
                                            Earned {formatCurrency(stat.earned)}
                                            </span>
                                        </div>
                                        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden flex">
                                            <div className="h-full bg-red-400/70" style={{ width: `${spentPerc}%` }}></div>
                                            <div className="h-full bg-green-400/80" style={{ width: `${earnedPerc}%` }}></div>
                                        </div>
                                        </div>
                                    );
                                    })}
                                </div>
                            </div>
                            
                            <div className="rounded-lg border border-gray-200 p-4 bg-white flex flex-col">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">
                                    Monthly Report
                                </h3>

                                {monthlyReport.length === 0 ? (
                                    <p className="text-sm text-gray-500">No transactions available</p>
                                ) : (
                                    <div className="space-y-3">
                                    {monthlyReport.map((item) => (
                                        <div
                                        key={item.month}
                                        className="p-3 border border-gray-200 rounded-lg"
                                        >
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-semibold text-gray-900">{item.month}</p>
                                            <p className="text-sm text-gray-500">
                                            Net: {formatCurrency(item.earned - item.spent)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs flex-wrap">
                                            <span className="px-2 py-1 rounded-full bg-green-50 text-green-700">
                                            Earned {formatCurrency(item.earned)}
                                            </span>
                                            <span className="px-2 py-1 rounded-full bg-red-50 text-red-700">
                                            Spent {formatCurrency(item.spent)}
                                            </span>
                                        </div>

                                        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden flex">
                                            <div
                                            className="h-full bg-green-400/80"
                                            style={{
                                                width: `${
                                                (item.earned / (item.earned + item.spent || 1)) * 100
                                                }%`,
                                            }}
                                            />
                                            <div
                                            className="h-full bg-red-400/70"
                                            style={{
                                                width: `${
                                                (item.spent / (item.earned + item.spent || 1)) * 100
                                                }%`,
                                            }}
                                            />
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                </div>
                        </div>
                    </div>
                )}

                {activeTab === "Transactions" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h3 className="font-semibold text-gray-900">
                                Bank Accounts
                            </h3>

                            {/* Button container */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button
                                onClick={() => setShowFilter(v => !v)}
                                className="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 text-center whitespace-nowrap"
                                >
                                Filter
                                </button>
                                <button
                                onClick={() => setShowCreate(v => !v)}
                                className="w-full sm:w-auto px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-center whitespace-nowrap"
                                >
                                Add Bank Account
                                </button>
                            </div>
                        </div>

                        {/* Filter Section */}
                        {showFilter && (
                            <div className="mb-4 p-3 border border-gray-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                
                                {/* Account */}
                                <div className="flex flex-col gap-1">
                                <label className="text-gray-600 font-medium">Account</label>
                                <select
                                    className="border border-gray-300 rounded-md px-2 py-1.5"
                                    value={filterAccount}
                                    onChange={e => setFilterAccount(e.target.value)}
                                >
                                    <option value="">All Accounts</option>
                                    {accounts.map(a => (
                                    <option key={a.id} value={a.id}>
                                        {a.accountName}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                {/* Category */}
                                <div className="flex flex-col gap-1">
                                <label className="text-gray-600 font-medium">Category</label>
                                <select
                                    className="border border-gray-300 rounded-md px-2 py-1.5"
                                    value={filterCategory}
                                    onChange={e => setFilterCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                    ))}
                                </select>
                                </div>

                                {/* From Date */}
                                <div className="flex flex-col gap-1">
                                <label className="text-gray-600 font-medium">From Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                                    value={filterFromDate}
                                    onChange={e => setFilterFromDate(e.target.value)}
                                />
                                </div>

                                {/* To Date */}
                                <div className="flex flex-col gap-1">
                                <label className="text-gray-600 font-medium">To Date</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-md px-2 py-1.5"
                                    value={filterToDate}
                                    onChange={e => setFilterToDate(e.target.value)}
                                />
                                </div>
                            </div>
                        )}


                        {/* Transactions List */}
                        <div className="space-y-3">
                        {filteredTxns.map((txn, index) => {
                            const account = accounts.find(a => a.id === txn.accountId);
                            const category = categories.find(c => c.id === txn.categoryId);
                            const isExpense = txn.amount < 0;

                            return (
                            <div
                                key={txn.id}
                                className="border border-gray-200 rounded-lg p-3"
                            >
                                {/* Header */}
                                <div className="grid grid-cols-3 text-xs text-gray-500">
                                <span>#{index + 1}</span>
                                <span className="text-center">{txn.date}</span>
                                <span className="text-right">12:30 AM</span>
                                </div>

                                <hr className="my-2 border-gray-200" />

                                {/* Main Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 text-sm">
                                <p className="font-medium text-gray-900 truncate">
                                    {category?.name || "Category"}
                                </p>

                                <p className="text-xs text-gray-500 truncate sm:text-center">
                                    {account?.accountName || "Account"}
                                </p>

                                <p
                                    className={`font-semibold sm:text-right ${
                                    isExpense ? "text-red-600" : "text-green-600"
                                    }`}
                                >
                                    {formatCurrency(txn.amount)}
                                </p>
                                </div>

                                <hr className="my-2 border-gray-200" />

                                {/* Actions */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-2 text-xs">
                                <p className="text-gray-600 truncate">
                                    {txn.note || ""}
                                </p>

                                <div className="flex justify-start sm:justify-end gap-2">
                                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                                    View
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                                    Edit
                                    </button>
                                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                                    Delete
                                    </button>
                                </div>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                )}

                {activeTab === "Bank Accounts" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                        {/* Header with button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Bank Accounts
                        </h3>
                        <button
                            onClick={() => setShowCreate(v => !v)} // use your showCreate state or separate for bank
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                        >
                            Add Bank Account
                        </button>
                        </div>

                        <div className="space-y-4">
                        {accounts.map(acc => (
                            <div
                            key={acc.id}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                            >
                            {/* Grid inside card */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                <div>
                                <p className="text-xs text-gray-500">Account</p>
                                <p className="font-medium text-gray-900 truncate">
                                    {acc.accountName}
                                </p>
                                </div>

                                <div>
                                <p className="text-xs text-gray-500">Bank</p>
                                <p className="text-gray-700 truncate">
                                    {acc.bankName}
                                </p>
                                </div>

                                <div>
                                <p className="text-xs text-gray-500">Account No</p>
                                <p className="font-mono text-gray-700 truncate">
                                    {acc.accountNumber || "XXXX-XXXX"}
                                </p>
                                </div>

                                <div>
                                <p className="text-xs text-gray-500">Balance</p>
                                <p className="font-semibold text-gray-900">
                                    {formatCurrency(acc.balance)}
                                </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-3 flex justify-end gap-2 text-xs border-t border-gray-200 pt-4">
                                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                                View
                                </button>
                                <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
                                Edit
                                </button>
                                <button className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50">
                                Delete
                                </button>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}

                {activeTab === "Categories" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 mt-4">
                        {/* Header with button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h3 className="font-semibold text-gray-900">
                            Categories
                        </h3>
                        <button
                            onClick={() => setShowCreate(v => !v)}
                            className="px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                        >
                            Add Category
                        </button>
                        </div>

                        <div className="space-y-2">
                        {categories.map(cat => (
                            <div
                            key={cat.id}
                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                            >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-center">
                                {/* Name and Type */}
                                <div className="">
                                    <p className="font-medium text-gray-900">{cat.name}</p>
                                </div>

                                {/* Empty for spacing on desktop */}
                                <div className="ml-auto lg:mx-auto">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 capitalize mt-1 sm:mt-0">
                                        {cat.type}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-gray-200 pt-2 sm:pt-0">
                                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-xs">
                                        View
                                    </button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 text-xs">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-xs">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page