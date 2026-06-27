// @ts-nocheck
'use client'
import React, { useState } from 'react';
import {
  X, Wallet as WalletIcon, TrendingUp, TrendingDown, Plus, Send,
  ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign, Euro, Calendar,
  Trophy, Gamepad2, Banknote, CheckCircle, Clock, AlertCircle,
  Building2, ShieldCheck, Filter, ChevronDown, Landmark, RefreshCw
} from 'lucide-react';

const walletHeaderLogo = '/assets/ChatGPT_Image_Jun_10__2026__11_30_49_AM-removebg-preview-1.png';

interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  balance?: number;
  onBalanceChange?: (newBalance: number) => void;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'tournament_win' | 'tournament_entry' | 'transfer_in' | 'transfer_out';
  amount: number;
  currency: 'EUR';
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

type PaymentMethod = 'paypal' | 'revolut' | 'bank_transfer';

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    icon: <Banknote className="w-5 h-5" />,
    color: 'from-[#003087] to-[#009cde]',
    desc: 'Instant · No fees',
  },
  {
    id: 'revolut',
    label: 'Revolut',
    icon: <RefreshCw className="w-5 h-5" />,
    color: 'from-[#191c1f] to-[#5a5f6e]',
    desc: 'Instant · No fees',
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    icon: <Landmark className="w-5 h-5" />,
    color: 'from-cyan-700 to-cyan-500',
    desc: '1–3 business days',
  },
];

const txIcon = (type: Transaction['type'], amount: number) => {
  if (type === 'tournament_win') return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
  if (type === 'tournament_entry') return <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
  if (type === 'deposit') return <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
  if (type === 'withdrawal') return <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
  return amount > 0
    ? <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
    : <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
};

const statusIcon = (status: Transaction['status']) => {
  if (status === 'completed') return <CheckCircle className="w-3 h-3" />;
  if (status === 'pending') return <Clock className="w-3 h-3" />;
  return <AlertCircle className="w-3 h-3" />;
};

export function Wallet({ isOpen, onClose, username, balance: externalBalance, onBalanceChange }: WalletProps) {
  const [balance, setBalance] = useState(externalBalance ?? 1250.50);

  React.useEffect(() => {
    if (externalBalance !== undefined) setBalance(externalBalance);
  }, [externalBalance]);

  const updateBalance = (val: number) => {
    setBalance(val);
    onBalanceChange?.(val);
    localStorage.setItem('finderq_wallet_balance', val.toString());
  };

  const [pendingBalance] = useState(350.00);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview');

  // Payment method selection
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<PaymentMethod | null>(null);
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<PaymentMethod | null>(null);

  // Withdraw submitted state (pending admin approval)
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);

  const transactions: Transaction[] = [
    { id: 1, type: 'tournament_win', amount: 500.00, currency: 'EUR', description: 'Spring Championship 2026 — 1st Place', date: '2026-04-05', status: 'completed' },
    { id: 2, type: 'tournament_entry', amount: -50.00, currency: 'EUR', description: 'Spring Championship 2026 — Entry Fee', date: '2026-04-01', status: 'completed' },
    { id: 3, type: 'deposit', amount: 200.00, currency: 'EUR', description: 'Deposit via VISA', date: '2026-03-28', status: 'completed' },
    { id: 4, type: 'tournament_win', amount: 150.00, currency: 'EUR', description: 'Weekly Cup #42 — 2nd Place', date: '2026-03-25', status: 'completed' },
    { id: 5, type: 'tournament_entry', amount: -25.00, currency: 'EUR', description: 'Weekly Cup #42 — Entry Fee', date: '2026-03-24', status: 'completed' },
    { id: 6, type: 'withdrawal', amount: -100.00, currency: 'EUR', description: 'Withdrawal to Bank Account', date: '2026-03-20', status: 'completed' },
    { id: 7, type: 'deposit', amount: 300.00, currency: 'EUR', description: 'Deposit via PayPal', date: '2026-03-15', status: 'completed' },
    { id: 8, type: 'tournament_win', amount: 75.00, currency: 'EUR', description: 'Friday Night Cup — 3rd Place', date: '2026-03-12', status: 'completed' },
    { id: 9, type: 'tournament_entry', amount: -15.00, currency: 'EUR', description: 'Friday Night Cup — Entry Fee', date: '2026-03-11', status: 'pending' },
    { id: 10, type: 'deposit', amount: 250.00, currency: 'EUR', description: 'Deposit via Revolut', date: '2026-03-08', status: 'completed' },
  ];

  const totalEarnings = transactions.filter(t => t.type === 'tournament_win' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'tournament_entry' && t.status === 'completed').reduce((s, t) => s + Math.abs(t.amount), 0);
  const netProfit = totalEarnings - totalSpent;
  const winCount = transactions.filter(t => t.type === 'tournament_win').length;
  const entryCount = transactions.filter(t => t.type === 'tournament_entry').length;

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'settings', label: 'Payment Methods' },
  ] as const;

  const resetDepositModal = () => {
    setShowDepositModal(false);
    setDepositAmount('');
    setSelectedDepositMethod(null);
  };

  const resetWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setSelectedWithdrawMethod(null);
    setWithdrawSubmitted(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[9999] p-2 sm:p-4">
      <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-5xl border border-green-500/20 shadow-2xl shadow-green-500/10 my-2 sm:my-0 flex flex-col max-h-[95vh] sm:max-h-[90vh]">

        {/* Header */}
        <div className="relative p-4 sm:p-5 md:p-6 border-b border-white/5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={walletHeaderLogo} alt="Wallet" className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain flex-shrink-0" />
              <div>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">My Wallet</h2>
                <p className="text-white/60 text-xs sm:text-sm">Manage your funds & tournament earnings</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
            </button>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-white/70 text-xs sm:text-sm font-medium">Available Balance</p>
                <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                  <Euro className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">€{balance.toFixed(2)}</p>
              <p className="text-green-400 text-xs font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12.5% this month
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-3 sm:p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-white/70 text-xs sm:text-sm font-medium">Pending</p>
                <div className="p-1.5 sm:p-2 bg-yellow-500/20 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">€{pendingBalance.toFixed(2)}</p>
              <p className="text-yellow-400 text-xs font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> Processing...
              </p>
            </div>

            <div className={`bg-gradient-to-br ${netProfit >= 0 ? 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20' : 'from-red-500/10 to-pink-500/10 border-red-500/20'} border rounded-xl p-3 sm:p-4 md:p-5`}>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-white/70 text-xs sm:text-sm font-medium">Net Profit</p>
                <div className={`p-1.5 sm:p-2 ${netProfit >= 0 ? 'bg-cyan-500/20' : 'bg-red-500/20'} rounded-lg`}>
                  {netProfit >= 0
                    ? <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    : <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />}
                </div>
              </div>
              <p className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${netProfit >= 0 ? 'text-cyan-400' : 'text-red-400'} mb-1`}>
                {netProfit >= 0 ? '+' : ''}€{netProfit.toFixed(2)}
              </p>
              <p className={`${netProfit >= 0 ? 'text-cyan-400' : 'text-red-400'} text-xs font-medium`}>From tournaments</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-3 sm:px-6 pt-3 sm:pt-4 border-b border-white/5 flex-shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-green-400' : 'text-white/50 hover:text-white/70'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">

          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 sm:p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-green-500/30 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">Deposit Funds</p>
                        <p className="text-white/60 text-xs sm:text-sm">Add money to your wallet</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-blue-500/30 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        <Send className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">Withdraw</p>
                        <p className="text-white/60 text-xs sm:text-sm">Transfer to your account</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Tournament Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                    <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Total Earnings</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">€{totalEarnings.toFixed(2)}</p>
                    <p className="text-white/50 text-xs mt-1 sm:mt-2">{winCount} wins</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                    <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Total Spent</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-400">€{totalSpent.toFixed(2)}</p>
                    <p className="text-white/50 text-xs mt-1 sm:mt-2">{entryCount} entries</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                    <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Win Rate</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400">
                      {entryCount > 0 ? ((winCount / entryCount) * 100).toFixed(0) : 0}%
                    </p>
                    <p className="text-white/50 text-xs mt-1 sm:mt-2">Success ratio</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Recent Activity</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map(tx => (
                    <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                          <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                            {txIcon(tx.type, tx.amount)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-xs sm:text-sm truncate">{tx.description}</p>
                            <p className="text-white/50 text-xs">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-base sm:text-xl font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.amount > 0 ? '+' : ''}€{Math.abs(tx.amount).toFixed(2)}
                          </p>
                          <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                            tx.status === 'completed' ? 'text-green-400' :
                            tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {statusIcon(tx.status)} {tx.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transactions */}
          {activeTab === 'transactions' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-white text-base sm:text-lg font-bold">All Transactions</h3>
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-white/40" />
                  <select className="bg-white/5 border border-white/10 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-green-400/50 appearance-none pr-6 relative">
                    <option value="all">All Types</option>
                    <option value="deposits">Deposits</option>
                    <option value="withdrawals">Withdrawals</option>
                    <option value="tournaments">Tournaments</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                {transactions.map(tx => (
                  <div key={tx.id} className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                          {txIcon(tx.type, tx.amount)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-xs sm:text-sm truncate">{tx.description}</p>
                          <p className="text-white/50 text-xs">{tx.date} · {tx.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-base sm:text-xl font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}€{Math.abs(tx.amount).toFixed(2)}
                        </p>
                        <span className={`text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full inline-flex items-center gap-0.5 ${
                          tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {statusIcon(tx.status)} {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === 'settings' && (
            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Saved Payment Methods</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 bg-blue-500/20 rounded-lg flex-shrink-0">
                          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm sm:text-base">VISA •••• 4242</p>
                          <p className="text-white/50 text-xs sm:text-sm">Expires 12/28</p>
                        </div>
                      </div>
                      <div className="px-2.5 sm:px-3 py-1 bg-green-500/20 rounded-full">
                        <p className="text-green-400 text-xs font-bold">Default</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-[#003087]/20 rounded-lg flex-shrink-0">
                        <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base">PayPal</p>
                        <p className="text-white/50 text-xs sm:text-sm">john.doe@email.com</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-dashed border-green-500/30 rounded-xl p-4 sm:p-5 hover:from-green-500/20 hover:to-emerald-500/20 transition-all group">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <p className="text-green-400 font-bold text-sm sm:text-base">Add New Payment Method</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Bank Account (Withdrawals)</h3>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-cyan-500/20 rounded-lg flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm sm:text-base">Bank Transfer (SEPA)</p>
                      <p className="text-white/50 text-xs sm:text-sm truncate">RO49 AAAA 1B31 0075 9384 0000</p>
                    </div>
                  </div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-2.5 sm:p-3">
                    <p className="text-cyan-400 text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      Verified · Withdrawals typically take 1–3 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Deposit Modal ── */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[10000] p-2 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-md border border-green-500/20 shadow-2xl shadow-green-500/10 my-4 sm:my-0">
            <div className="p-4 sm:p-5 md:p-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white">Deposit Funds</h3>
                <button onClick={resetDepositModal} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                </button>
              </div>
              <p className="text-white/60 text-xs sm:text-sm">Add money to your FinderQ wallet</p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedDepositMethod(method.id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        selectedDepositMethod === method.id
                          ? 'border-green-500/60 bg-green-500/10 shadow-lg shadow-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color} text-white`}>
                        {method.icon}
                      </div>
                      <span className="text-white text-xs font-semibold">{method.label}</span>
                      <span className="text-white/40 text-[10px] text-center leading-tight">{method.desc}</span>
                      {selectedDepositMethod === method.id && (
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-2">Amount (EUR)</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-green-400 font-bold text-lg sm:text-xl">€</span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg pl-8 sm:pl-10 pr-4 py-3 sm:py-4 text-white text-xl sm:text-2xl font-bold placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="px-2 sm:px-4 py-2 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 rounded-lg text-white text-xs sm:text-sm font-semibold transition-all"
                  >
                    €{amount}
                  </button>
                ))}
              </div>

              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2.5 sm:p-3">
                <p className="text-green-400 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  Instant deposit · No fees · Secure payment
                </p>
              </div>

              <button
                onClick={() => {
                  alert(`Deposit of €${depositAmount} via ${PAYMENT_METHODS.find(m => m.id === selectedDepositMethod)?.label} initiated!\n\nYou would be redirected to payment gateway.`);
                  resetDepositModal();
                }}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0 || !selectedDepositMethod}
                className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedDepositMethod ? `Continue with ${PAYMENT_METHODS.find(m => m.id === selectedDepositMethod)?.label}` : 'Select a Method to Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Withdraw Modal ── */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[10000] p-2 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-md border border-blue-500/20 shadow-2xl shadow-blue-500/10 my-4 sm:my-0">
            <div className="p-4 sm:p-5 md:p-6 border-b border-white/5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white">Withdraw Funds</h3>
                <button onClick={resetWithdrawModal} className="p-1.5 sm:p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                </button>
              </div>
              <p className="text-white/60 text-xs sm:text-sm">Transfer to your account</p>
            </div>

            <div className="p-4 sm:p-5 md:p-6 space-y-4">
              {withdrawSubmitted ? (
                /* Success / Pending Admin Approval State */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg mb-1">Withdrawal Request Submitted</p>
                    <p className="text-white/60 text-sm">
                      Your withdrawal of <span className="text-white font-semibold">€{withdrawAmount}</span> via{' '}
                      <span className="text-white font-semibold">{PAYMENT_METHODS.find(m => m.id === selectedWithdrawMethod)?.label}</span> is pending admin approval.
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <p className="text-yellow-400 text-xs flex items-center justify-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      An administrator must approve this withdrawal before funds are released.
                    </p>
                  </div>
                  <button
                    onClick={resetWithdrawModal}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-all font-semibold text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4">
                    <p className="text-white/60 text-xs sm:text-sm mb-1">Available Balance</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">€{balance.toFixed(2)}</p>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-2">Withdraw To</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PAYMENT_METHODS.map(method => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedWithdrawMethod(method.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                            selectedWithdrawMethod === method.id
                              ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color} text-white`}>
                            {method.icon}
                          </div>
                          <span className="text-white text-xs font-semibold">{method.label}</span>
                          <span className="text-white/40 text-[10px] text-center leading-tight">{method.desc}</span>
                          {selectedWithdrawMethod === method.id && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-xs sm:text-sm font-medium mb-2">Amount (EUR)</label>
                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold text-lg sm:text-xl">€</span>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        max={balance}
                        className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg pl-8 sm:pl-10 pr-4 py-3 sm:py-4 text-white text-xl sm:text-2xl font-bold placeholder:text-white/40 focus:outline-none focus:border-blue-400/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setWithdrawAmount(balance.toString())}
                    className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium transition-colors"
                  >
                    Withdraw All
                  </button>

                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5 sm:p-3">
                    <p className="text-yellow-400 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      Withdrawals require admin approval before processing
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setWithdrawSubmitted(true);
                    }}
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > balance || !selectedWithdrawMethod}
                    className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedWithdrawMethod ? `Request Withdrawal via ${PAYMENT_METHODS.find(m => m.id === selectedWithdrawMethod)?.label}` : 'Select a Method to Continue'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}