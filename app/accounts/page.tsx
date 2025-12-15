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
  { name: "Bank Accounts", icon: Banknote },
  { name: "Overview", icon: BarChart3 },
  { name: "Categories", icon: Layers3 },
  { name: "Transactions", icon: ListChecks },
];

const CATEGORY_COLORS = ["#6366F1", "#EC4899", "#F97316", "#0EA5E9", "#22C55E", "#A855F7", "#F43F5E", "#14B8A6"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const AccountsPage = () => {
  const [activeTab, setActiveTab] = useState("Bank Accounts");
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

  // --- UI HANDLERS ---
  const handleCreateAccount = (e: any) => {
    e.preventDefault();
    if (newAccount.accountName && newAccount.bankName && newAccount.balance) {
      setAccounts([
        ...accounts,
        { id: Date.now().toString(), accountName: newAccount.accountName, bankName: newAccount.bankName, balance: parseFloat(newAccount.balance) },
      ]);
      setNewAccount({ accountName: "", bankName: "", balance: "" });
      setShowCreate(false);
    }
  };
  const handleCreateCategory = (e: any) => {
    e.preventDefault();
    if (newCategory.name && newCategory.type) {
      setCategories([
        ...categories,
        { id: Date.now().toString(), name: newCategory.name, type: newCategory.type },
      ]);
      setNewCategory({ name: "", type: "expense" });
      setShowCreate(false);
    }
  };
  const handleCreateTxn = (e: any) => {
    e.preventDefault();
    if (newTxn.date && newTxn.accountId && newTxn.categoryId && newTxn.amount) {
      setTransactions([
        ...transactions,
        { id: Date.now().toString(), ...newTxn, amount: parseFloat(newTxn.amount) },
      ]);
      setNewTxn({ date: "", accountId: accounts[0]?.id || "", categoryId: categories[0]?.id || "", amount: "", note: "" });
      setShowCreate(false);
    }
  };

  const filteredTxns = transactions.filter(
    t => (!filterCategory || t.categoryId === filterCategory) && (!filterAccount || t.accountId === filterAccount)
  );

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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Main Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-2 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setShowFilter(false);
                setShowCreate(false);
              }}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all text-base whitespace-nowrap ${
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

      {/* Content Cards */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Bank Accounts Tab */}
        {activeTab === "Bank Accounts" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-gray-900">Bank Accounts</div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setShowCreate((v) => !v)}
              >
                <Plus size={18} />Create Account
              </button>
            </div>
            {showCreate && (
              <form className="mb-6 p-4 border border-gray-200 bg-white rounded-lg flex flex-col gap-3" onSubmit={handleCreateAccount}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Account Name</label>
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={newAccount.accountName} onChange={e => setNewAccount(a => ({ ...a, accountName: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Bank Name</label>
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={newAccount.bankName} onChange={e => setNewAccount(a => ({ ...a, bankName: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Balance</label>
                  <input type="number" step="0.01" className="border border-gray-300 rounded-lg px-3 py-2" value={newAccount.balance} onChange={e => setNewAccount(a => ({ ...a, balance: e.target.value }))} required />
                </div>
                <button type="submit" className="ml-auto mt-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">Save</button>
              </form>
            )}
            <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Account Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Bank</th>
                    <th className="px-4 py-3 text-right font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {accounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{acc.accountName}</td>
                      <td className="px-4 py-3 text-gray-600">{acc.bankName}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">{formatCurrency(acc.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending & Earnings Mix - Fixed Height */}
              <div className="rounded-lg border border-gray-200 p-6 bg-white h-[500px] flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 mb-6">Spending & Earnings Mix</h3>
                <div className="flex flex-col lg:flex-row items-center gap-6 flex-1 overflow-y-auto">
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <div className="w-full h-full rounded-full" style={{ background: pieBackground }}></div>
                    <div className="absolute inset-10 rounded-full bg-white border border-gray-200 flex flex-col items-center justify-center text-center">
                      <span className="text-xs text-gray-500">Total Flow</span>
                      <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalCategoryValue)}</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    {categoryStats.map((stat) => (
                      <div key={stat.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: stat.color }}></span>
                          <span className="font-medium text-gray-900">{stat.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {stat.totalAbs > 0 && totalCategoryValue > 0
                            ? `${Math.round((stat.totalAbs / totalCategoryValue) * 100)}%`
                            : "0%"}
                        </span>
                      </div>
                    ))}
                    {!categoryStats.length && (
                      <p className="text-sm text-gray-500">No category activity yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category Spend vs Earn - Fixed Height with Scroll */}
              <div className="rounded-lg border border-gray-200 p-6 bg-white h-[500px] flex flex-col">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Category Spend vs Earn</h3>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
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
            </div>

            <div className="rounded-lg border border-gray-200 p-6 bg-white">
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
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "Categories" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-gray-900">Categories</div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setShowCreate((v) => !v)}
              >
                <Plus size={18} />Create Category
              </button>
            </div>
            {showCreate && (
              <form className="mb-6 p-4 border border-gray-200 bg-white rounded-lg flex flex-col gap-3" onSubmit={handleCreateCategory}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Category Name</label>
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={newCategory.name} onChange={e => setNewCategory(a => ({ ...a, name: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Type</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={newCategory.type} onChange={e => setNewCategory(a => ({ ...a, type: e.target.value }))} required>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <button type="submit" className="ml-auto mt-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">Save</button>
              </form>
            )}
            <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {categories.map(cat => (
                    <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cat.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          <span className={`w-2 h-2 rounded-full ${cat.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "Transactions" && (
          <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setShowFilter((v) => !v)}
                >
                  <Filter size={18} />Filter
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => setShowCreate((v) => !v)}
                >
                  <Plus size={18} />Create Transaction
                </button>
              </div>
            </div>
            {showFilter && (
              <div className="mb-6 p-4 border border-gray-200 bg-white rounded-lg flex gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Account</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={filterAccount} onChange={e => setFilterAccount(e.target.value)}>
                    <option value="">All Accounts</option>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Category</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            )}
            {showCreate && (
              <form className="mb-6 p-4 border border-gray-200 bg-white rounded-lg flex flex-col gap-3" onSubmit={handleCreateTxn}>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Date</label>
                  <input type="date" className="border border-gray-300 rounded-lg px-3 py-2" value={newTxn.date} onChange={e => setNewTxn(a => ({ ...a, date: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Account</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={newTxn.accountId} onChange={e => setNewTxn(a => ({ ...a, accountId: e.target.value }))} required>
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.accountName}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Category</label>
                  <select className="border border-gray-300 rounded-lg px-3 py-2" value={newTxn.categoryId} onChange={e => setNewTxn(a => ({ ...a, categoryId: e.target.value }))} required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Amount</label>
                  <input type="number" className="border border-gray-300 rounded-lg px-3 py-2" value={newTxn.amount} onChange={e => setNewTxn(a => ({ ...a, amount: e.target.value }))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-700">Note</label>
                  <input className="border border-gray-300 rounded-lg px-3 py-2" value={newTxn.note} onChange={e => setNewTxn(a => ({ ...a, note: e.target.value }))} />
                </div>
                <button type="submit" className="ml-auto mt-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">Save</button>
              </form>
            )}
            <div className="rounded-lg border border-gray-200 overflow-hidden mt-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Account</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-right font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredTxns.map(txn => {
                    const account = accounts.find(a => a.id === txn.accountId);
                    const category = categories.find(c => c.id === txn.categoryId);
                    const isExpense = txn.amount < 0;
                    return (
                      <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">{txn.date}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{account?.accountName || "-"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${category?.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="text-gray-700">{category?.name || "-"}</span>
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold ${isExpense ? "text-red-600" : "text-green-700"}`}>
                          {formatCurrency(txn.amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{txn.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;