// database.ts -- shared hardcoded mock data for the app
export const workTypes = [
  { id: '1', name: 'Web Design' },
  { id: '2', name: 'Web Development' },
];

export const leads = [
  {
    id: '1',
    clientName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    description: 'Need a modern website for startup',
    budget: '$5000',
    status: 'lead' as const,
    createdAt: '2024-01-15',
    followups: []
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1234567891',
    description: 'E-commerce website needed',
    budget: '$8000',
    status: 'work' as const,
    createdAt: '2024-01-10',
    followups: [
      { id: '1', date: '2024-01-12', note: 'Discussed requirements' }
    ]
  }
];

export const accounts = [
  { id: '1', accountName: 'Personal Savings', bankName: 'Chase', balance: 5500.34 },
  { id: '2', accountName: 'Family Checking', bankName: 'Wells Fargo', balance: 2100.00 },
  { id: '3', accountName: 'Business Account', bankName: 'Bank of America', balance: 12000 },
];

export const categories = [
  { id: 'cat1', name: 'Food & Dining', type: 'expense' },
  { id: 'cat2', name: 'Transportation', type: 'expense' },
  { id: 'cat3', name: 'Salary', type: 'income' },
  { id: 'cat4', name: 'Shopping', type: 'expense' },
  { id: 'cat5', name: 'Freelance', type: 'income' },
];

export const transactions = [
  { id: 'txn1', date: '2024-06-01', accountId: '1', categoryId: 'cat1', amount: -75, note: 'Groceries' },
  { id: 'txn2', date: '2024-06-02', accountId: '1', categoryId: 'cat3', amount: 2500, note: 'Monthly Salary' },
  { id: 'txn3', date: '2024-06-03', accountId: '2', categoryId: 'cat2', amount: -40, note: 'Uber Ride' },
  { id: 'txn4', date: '2024-06-04', accountId: '3', categoryId: 'cat5', amount: 800, note: 'Website Job' },
  { id: 'txn5', date: '2024-06-04', accountId: '2', categoryId: 'cat4', amount: -120, note: 'Clothes' },
];

export const businessEarnings = [
  { id: 'biz1', name: 'Stores', amount: 12450, trend: '+6.2%' },
  { id: 'biz2', name: 'Freelance', amount: 8650, trend: '+3.4%' },
  { id: 'biz3', name: 'SaaS', amount: 10320, trend: '+5.1%' },
  { id: 'biz4', name: 'Monetisation', amount: 7420, trend: '+2.8%' },
];

// Add and export more demo/mock objects as your app grows (e.g. fitnessTodos, properties, checklist, etc)
