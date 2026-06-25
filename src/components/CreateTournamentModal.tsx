// @ts-nocheck
'use client'
import React, { useState } from 'react';
import { X, Trophy, DollarSign, Calendar, Users, Info, MapPin, Target, Award, Clock, FileText } from 'lucide-react';

interface CreateTournamentModalProps {
  onClose: () => void;
  onCreateTournament: (tournament: any) => void;
  organizerName: string;
  organizerAvatar?: string;
}

type PaymentMethod = 'visa' | 'mastercard' | 'amex' | 'applepay' | 'googlepay' | 'paypal' | 'stripe' | 'revolut' | 'crypto';

export function CreateTournamentModal({ onClose, onCreateTournament, organizerName, organizerAvatar }: CreateTournamentModalProps) {
  const [step, setStep] = useState(1);
  
  const [tournamentName, setTournamentName] = useState('');
  const [prize, setPrize] = useState('');
  const [prizeDistribution, setPrizeDistribution] = useState({ first: '50', second: '30', third: '20' });
  const [startDate, setStartDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [format, setFormat] = useState<'Single Elimination'>('Single Elimination');
  const [teamSize, setTeamSize] = useState<'1v1' | '5v5'>('5v5');
  const [maxTeams, setMaxTeams] = useState('16');
  const [region, setRegion] = useState<string>('EUW');
  const [rankRequirement, setRankRequirement] = useState('');
  const [rules, setRules] = useState('');
  const [description, setDescription] = useState('');
  const [moneyAdded, setMoneyAdded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('visa');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalPassword, setPaypalPassword] = useState('');
  const [cryptoWallet, setCryptoWallet] = useState('');

  const handleSubmit = () => {
    const newTournament = {
      id: Date.now(),
      name: tournamentName,
      organizer: organizerName,
      organizerAvatar,
      prize: parseFloat(prize),
      currency: 'EUR',
      prizeDistribution: {
        first: parseFloat(prizeDistribution.first),
        second: parseFloat(prizeDistribution.second),
        third: parseFloat(prizeDistribution.third)
      },
      startDate,
      registrationDeadline,
      format,
      teamSize,
      maxTeams: parseInt(maxTeams),
      region,
      rankRequirement,
      rules: rules.split('\n').filter(r => r.trim()),
      description,
      status: 'pending',
      registeredTeams: 0,
      submittedDate: new Date().toISOString(),
      paymentMethod
    };
    onCreateTournament(newTournament);
    onClose();
  };

  const isStep1Valid = tournamentName && prize && parseFloat(prize) > 0 && startDate && registrationDeadline;
  const isStep2Valid = maxTeams && format && teamSize;
  const isStep3Valid = (() => {
    const total = parseFloat(prizeDistribution.first || '0') +
      parseFloat(prizeDistribution.second || '0') +
      parseFloat(prizeDistribution.third || '0');
    return rules && description && total === 100;
  })();

  const handlePaymentConfirmation = () => {
    setIsProcessingPayment(true);
    const amount = parseFloat(prize || '0').toFixed(2);
    const paymentSimulations: Record<PaymentMethod, () => void> = {
      visa: () => alert(`💳 VISA Payment Processing\n\n✓ Connecting to VISA secure payment gateway\n✓ Amount: €${amount}\n✓ Processing with 3D Secure\n\n(Demo: In production, you would be redirected to VISA's secure payment page)`),
      mastercard: () => alert(`💳 Mastercard Payment Processing\n\n✓ Connecting to Mastercard SecureCode\n✓ Amount: €${amount}\n✓ Verifying with Mastercard Identity Check\n\n(Demo: In production, you would complete Mastercard's secure authentication)`),
      amex: () => alert(`💎 American Express Payment\n\n✓ Connecting to American Express SafeKey\n✓ Amount: €${amount}\n✓ Premium card processing\n\n(Demo: In production, you would be redirected to Amex secure checkout)`),
      applepay: () => alert(`🍎 Apple Pay\n\n✓ Opening Apple Pay sheet\n✓ Amount: €${amount}\n✓ Authenticate with Face ID / Touch ID\n\n(Demo: In production, the Apple Pay payment sheet would appear for biometric authentication)`),
      googlepay: () => alert(`🟢 Google Pay\n\n✓ Launching Google Pay\n✓ Amount: €${amount}\n✓ Quick & secure checkout\n\n(Demo: In production, Google Pay would open for instant payment)`),
      paypal: () => alert(`💙 PayPal Payment\n\n✓ Redirecting to PayPal\n✓ Amount: €${amount}\n✓ Login with your PayPal account\n\n(Demo: In production, you would be redirected to paypal.com/checkoutnow)`),
      stripe: () => alert(`💜 Stripe Payment Processing\n\n✓ Processing payment via Stripe\n✓ Amount: €${amount}\n✓ PCI-DSS compliant processing\n✓ 3D Secure 2 authentication\n\n(Demo: In production, Stripe would handle the secure payment flow)`),
      revolut: () => alert(`🔵 Revolut Payment\n\n✓ Opening Revolut checkout\n✓ Amount: €${amount}\n✓ Instant bank transfer\n✓ No fees for EUR transactions\n\n(Demo: In production, you would be redirected to Revolut's secure payment page)`),
      crypto: () => alert(`₿ Cryptocurrency Payment\n\n✓ Redirecting to crypto gateway\n✓ Amount: €${amount} EUR\n✓ Multiple cryptocurrencies accepted\n✓ Real-time conversion rates\n\n(Demo: In production, you would be redirected to Coinbase Commerce or BitPay)`),
    };
    paymentSimulations[paymentMethod]();
    setTimeout(() => {
      setIsProcessingPayment(false);
      setMoneyAdded(true);
      setShowPaymentModal(false);
      alert(`✅ Payment Successful!\n\n€${amount} has been committed to the tournament prize pool via ${paymentMethod.toUpperCase()}.\n\nYou can now create your tournament!`);
    }, 2500);
  };

  const paymentMethods = [
    {
      id: 'visa' as const, name: 'VISA', color: '#1A1F71',
      logo: (
        <svg viewBox="0 0 48 16" className="w-full h-full" fill="currentColor">
          <path d="M19.5 1.5l-4.9 13h-3.2l-2.4-9.4c-.1-.5-.3-.7-.7-.9-.7-.3-1.8-.6-2.8-.8l.1-.4h4.8c.6 0 1.2.4 1.3 1.1l1.2 6.4 3-7.5h3.6zm14.3 8.7c0-3.4-4.7-3.6-4.7-5.1 0-.5.4-.9 1.4-1.1.5-.1 1.7-.1 3.1.5l.6-2.7c-.8-.3-1.8-.5-3-.5-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.3.6 1.7 1 1.7 1.5 0 .8-1 1.2-1.9 1.2-1.6 0-2.5-.4-3.2-.7l-.6 2.8c.7.3 2.1.6 3.5.6 3.4.1 5.7-1.6 5.7-4zm8.1 4.3h3.1l-2.7-13h-2.9c-.7 0-1.2.4-1.5 1l-5.2 12h3.2l.6-1.7h4l.4 1.7zm-3.5-4.1l1.7-4.6 1 4.6h-2.7zm-15.3-8.9l-2.5 13h-3.1l2.5-13h3.1z"/>
        </svg>
      )
    },
    {
      id: 'mastercard' as const, name: 'Mastercard', color: '#EB001B',
      logo: (
        <svg viewBox="0 0 48 30" className="w-full h-full">
          <circle cx="15" cy="15" r="12" fill="#EB001B"/>
          <circle cx="33" cy="15" r="12" fill="#FF5F00" opacity="0.8"/>
          <circle cx="33" cy="15" r="12" fill="#F79E1B"/>
        </svg>
      )
    },
    {
      id: 'amex' as const, name: 'Amex', color: '#006FCF',
      logo: (
        <svg viewBox="0 0 48 30" className="w-full h-full" fill="currentColor">
          <path d="M4 6h40v18H4z"/>
          <text x="24" y="19" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">AMEX</text>
        </svg>
      )
    },
    {
      id: 'applepay' as const, name: 'Apple Pay', color: '#000000',
      logo: (
        <svg viewBox="0 0 48 20" className="w-full h-full" fill="currentColor">
          <path d="M9.5 3.5c.6-.7 1-1.7.9-2.7-.9.1-2 .6-2.6 1.3-.6.6-1.1 1.6-1 2.6 1.1.1 2.1-.5 2.7-1.2zm.9 1.4c-1.5-.1-2.7 1.3-2.7 2.9 0 1.6 1.2 2.9 2.7 2.9 1.5 0 2.7-1.3 2.7-2.9s-1.2-2.9-2.7-2.9zM21 5h-2.5v9h1.5v-3.2h1c1.7 0 2.9-1.2 2.9-2.9S22.7 5 21 5zm-.2 4.5h-.8V6.2h.8c1.1 0 1.8.7 1.8 1.6s-.7 1.7-1.8 1.7zm7.7-1.7c0-.9-.7-1.6-1.7-1.6s-1.7.7-1.7 1.6v.4h1.3v-.4c0-.3.2-.5.4-.5s.4.2.4.5v.3l-1.5.6c-.7.3-1.2.8-1.2 1.7 0 .9.7 1.6 1.7 1.6.6 0 1.2-.3 1.5-.8h.1v.7h1.2v-3.5-.6zm-1.5 2.5c-.2.3-.5.5-.9.5s-.6-.2-.6-.5.2-.4.6-.6l.9-.3v.9zm5.5-4.1c-.5 0-1 .2-1.3.6v-3h-1.4v9h1.3v-.6c.3.4.7.6 1.3.6 1.3 0 2.2-1 2.2-2.8s-.9-2.8-2.1-2.8zm-.4 4.5c-.6 0-1-.5-1-1.3v-.4c0-.8.4-1.3 1-1.3s1 .5 1 1.3v.4c0 .8-.4 1.3-1 1.3zm5.6-1.5l1.5-2.9h-1.5l-.8 1.7-.8-1.7h-1.6l1.5 2.9-1.6 3h1.5l.9-1.8.9 1.8h1.6l-1.6-3z"/>
        </svg>
      )
    },
    {
      id: 'googlepay' as const, name: 'Google Pay', color: '#4285F4',
      logo: (
        <svg viewBox="0 0 48 20" className="w-full h-full">
          <path fill="#4285F4" d="M23 8v5.5h-2V2h4.6c1.1 0 2.2.4 3 1.2.8.8 1.3 1.9 1.3 3.1s-.5 2.3-1.3 3.1c-.8.8-1.9 1.2-3 1.2H23zm0-4.5v3.2h2.6c.6 0 1.1-.2 1.5-.6.8-.8.8-2 0-2.7-.4-.4-.9-.6-1.5-.6H23z"/>
          <path fill="#34A853" d="M33 8.3c-1.2 0-2.2.4-2.9 1.1-.7.7-1.1 1.7-1.1 2.9s.4 2.2 1.1 2.9c.7.7 1.7 1.1 2.9 1.1 1.1 0 2-.4 2.7-1.1v.9c0 1.2-.6 1.9-1.7 1.9-.9 0-1.5-.6-1.7-1.2l-1.7.7c.5 1.3 1.8 2.2 3.4 2.2 1 0 1.9-.3 2.6-1 .7-.7 1.1-1.7 1.1-3v-5.5h-1.9v.8c-.6-.7-1.5-1.1-2.6-1.1zm.2 5.5c-1 0-1.8-.8-1.8-1.9s.8-1.9 1.8-1.9 1.8.8 1.8 1.9-.8 1.9-1.8 1.9z"/>
          <path fill="#FBBC04" d="M42.6 8.3c-1.4 0-2.6 1.1-2.6 2.6v.3c0 1.4 1.1 2.5 2.6 2.5 1.1 0 2.1-.7 2.4-1.7l-1.7-.7c-.2.5-.6.7-1.1.7-.7 0-1.2-.5-1.3-1.1h3.8v-.3c0-1.5-1.1-2.6-2.6-2.6zm0 1.5c.5 0 .9.3 1 .8h-2.1c.1-.5.6-.8 1.1-.8z"/>
          <path fill="#EA4335" d="M11 10c0 .5.1 1 .2 1.4L7.8 8.1c-.6.6-.9 1.4-.9 2.3s.3 1.7.9 2.3l3.4-3.4c-.1-.4-.2-.9-.2-1.4z"/>
          <path fill="#FBBC04" d="M11 6.7v-.5c0-.6-.5-1.1-1.1-1.1-.3 0-.6.1-.8.3L5.7 8.8C6.4 7.5 7.7 6.7 9.2 6.7c.6 0 1.2.1 1.8.3z"/>
          <path fill="#34A853" d="M11 13.3c0 .5-.1 1-.2 1.4l3.4 3.4c.6-.6.9-1.4.9-2.3s-.3-1.7-.9-2.3l-3.4 3.4c.1-.4.2-.9.2-1.4z"/>
          <path fill="#4285F4" d="M9.2 16.7c-1.5 0-2.8-.8-3.5-2.1l-3.4 3.4c.2.2.5.4.8.3.6 0 1.1-.5 1.1-1.1v.5c0 1.8 1.5 3.3 3.3 3.3 1.1 0 2.1-.5 2.7-1.3-.6.2-1.2.3-1.8.3z"/>
        </svg>
      )
    },
    {
      id: 'paypal' as const, name: 'PayPal', color: '#003087',
      logo: (
        <svg viewBox="0 0 48 30" className="w-full h-full">
          <path fill="#003087" d="M18.1 8.5c.5 1.3.6 2.8.2 4.3-.8 3-3.1 4.8-6.1 4.8h-.4c-.4 0-.7.3-.8.7l-.5 3.1-.1.9c0 .4-.4.7-.8.7H6.5c-.3 0-.5-.3-.5-.6l2-12.7c.1-.5.5-.9 1-.9h4.8c1.5 0 2.6.3 3.3 1zm-1.2 4.2c-.4 2-2.1 3.2-4.5 3.2h-.9l.6-3.9c0-.3.3-.5.5-.5h.4c1.2 0 2.3 0 2.9.7.4.4.5.9.4 1.5z"/>
          <path fill="#009CDE" d="M29.9 8.5c.5 1.3.6 2.8.2 4.3-.8 3-3.1 4.8-6.1 4.8h-.4c-.4 0-.7.3-.8.7l-.5 3.1-.1.9c0 .4-.4.7-.8.7h-3.1c-.3 0-.5-.3-.5-.6l2-12.7c.1-.5.5-.9 1-.9h4.8c1.5 0 2.6.3 3.3 1zm-1.2 4.2c-.4 2-2.1 3.2-4.5 3.2h-.9l.6-3.9c0-.3.3-.5.5-.5h.4c1.2 0 2.3 0 2.9.7.4.4.5.9.4 1.5z"/>
          <path fill="#012169" d="M41.7 8.5c.5 1.3.6 2.8.2 4.3-.8 3-3.1 4.8-6.1 4.8h-.4c-.4 0-.7.3-.8.7l-.5 3.1-.1.9c0 .4-.4.7-.8.7h-3.1c-.3 0-.5-.3-.5-.6l2-12.7c.1-.5.5-.9 1-.9h4.8c1.5 0 2.6.3 3.3 1zm-1.2 4.2c-.4 2-2.1 3.2-4.5 3.2h-.9l.6-3.9c0-.3.3-.5.5-.5h.4c1.2 0 2.3 0 2.9.7.4.4.5.9.4 1.5z"/>
        </svg>
      )
    },
    {
      id: 'stripe' as const, name: 'Stripe', color: '#635BFF',
      logo: (
        <svg viewBox="0 0 48 20" className="w-full h-full" fill="currentColor">
          <path d="M24 5.4c-3.5 0-5.7 1.9-5.7 4.9 0 3.3 2.9 4.4 5.1 5.3 2.6 1 3 1.6 3 2.6 0 1.5-1.3 2.2-3.1 2.2-2 0-3.8-.6-5.4-1.5v4.2c1.7.7 3.5 1 5.4 1 3.7 0 6-1.8 6-5 0-3.4-2.9-4.5-5.2-5.4-2.4-.9-2.9-1.4-2.9-2.4 0-1.2 1-1.9 2.8-1.9 1.8 0 3.6.5 5.2 1.4V5.9c-1.6-.7-3.3-1-5.2-1z"/>
        </svg>
      )
    },
    {
      id: 'revolut' as const, name: 'Revolut', color: '#0075EB',
      logo: (
        <svg viewBox="0 0 48 30" className="w-full h-full" fill="currentColor">
          <path d="M8 8h4c3.3 0 6 2.7 6 6s-2.7 6-6 6h-2v8H8V8zm2 10h2c2.2 0 4-1.8 4-4s-1.8-4-4-4h-2v8zm14-10h4.5c2.5 0 4.5 2 4.5 4.5 0 1.9-1.2 3.5-2.8 4.2l3.3 6.3h-2.3l-3.1-6h-2.1v6H24V8zm2 6h2.5c1.4 0 2.5-1.1 2.5-2.5S30.9 9 29.5 9H26v5z"/>
        </svg>
      )
    },
    {
      id: 'crypto' as const, name: 'Crypto', color: '#F7931A',
      logo: (
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="currentColor">
          <path d="M37.3 19.8c.5-3.2-2-4.9-5.3-6.1l1.1-4.3-2.6-.7-1 4.2c-.7-.2-1.4-.3-2.1-.5l1-4.2-2.6-.7-1.1 4.3c-.6-.1-1.1-.3-1.7-.4l-3.6-.9-.7 2.8s1.9.4 1.9.5c1 .3 1.3 1 1.2 1.5l-2.9 11.8c-.2.3-.5.8-1.2.6 0 0-1.9-.5-1.9-.5l-1.3 3 3.4.8c.6.2 1.2.3 1.9.5l-1.1 4.4 2.6.7 1.1-4.3c.7.2 1.5.4 2.2.5l-1.1 4.3 2.6.7 1.1-4.4c4.5.9 7.9.5 9.3-3.5 1.1-3.3-.1-5.2-2.4-6.4 1.7-.4 3-1.5 3.3-3.9zm-5.9 8.4c-.8 3.3-6.3 1.5-8.1 1.1l1.4-5.8c1.8.4 7.5 1.3 6.7 4.7zm.8-8.5c-.7 3-5.3 1.5-6.8 1.1l1.3-5.3c1.5.4 6.3 1 5.5 4.2z"/>
        </svg>
      )
    }
  ];

  const prizeTotal = parseFloat(prizeDistribution.first || '0') +
    parseFloat(prizeDistribution.second || '0') +
    parseFloat(prizeDistribution.third || '0');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4">
      {/* Main Modal */}
      <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-3xl flex flex-col border border-[#00d4ff]/20 shadow-2xl shadow-[#00d4ff]/10"
        style={{ maxHeight: '90dvh' }}>

        {/* Header */}
        <div className="relative p-3 sm:p-4 border-b border-white/5 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/5 to-purple-500/5 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#00d4ff] to-[#00a3cc] rounded-xl shadow-lg shadow-[#00d4ff]/20">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white">Create Tournament</h2>
                <p className="text-white/50 text-[10px] sm:text-xs hidden xs:block">Host your own League of Legends tournament</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="relative flex items-center justify-between mt-4 sm:mt-6 px-4 sm:px-20">
            {[1, 2, 3].map((stepNum, index) => (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center gap-1 sm:gap-2 relative z-10">
                  <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold transition-all duration-300 text-base sm:text-2xl border-4 sm:border-[6px] ${
                    step >= stepNum
                      ? 'bg-gradient-to-br from-[#00d4ff] to-[#00a3cc] text-white shadow-lg shadow-[#00d4ff]/30 border-[#00d4ff]'
                      : 'bg-white/5 text-white/30 border-white/20'
                  }`}>
                    {stepNum}
                  </div>
                  <span className={`text-[10px] sm:text-sm font-bold whitespace-nowrap ${step >= stepNum ? 'text-white' : 'text-white/30'}`}>
                    {stepNum === 1 ? 'Basic Info' : stepNum === 2 ? 'Settings' : 'Details'}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 sm:h-1.5 mx-2 sm:mx-12 transition-all duration-300 rounded-full ${
                    step > stepNum ? 'bg-[#00d4ff]' : 'bg-white/10'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 overscroll-contain">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1.5">Tournament Name *</label>
                <input
                  type="text"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="e.g., Spring Championship 2026"
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff]/50"
                />
              </div>

              <div>
                <label className="block text-white text-xs sm:text-sm font-medium mb-1.5">Prize Pool (EUR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 font-bold text-sm">€</span>
                  <input
                    type="number"
                    value={prize}
                    onChange={(e) => setPrize(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg pl-8 pr-3 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-green-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                    <Calendar className="w-3 h-3 text-[#00d4ff]" /> Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                    <Clock className="w-3 h-3 text-purple-400" /> Registration Ends *
                  </label>
                  <input
                    type="date"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                  <MapPin className="w-3 h-3 text-yellow-400" /> Region *
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-500/50"
                >
                  <option value="EUW">EUW — Europe West</option>
                  <option value="EUNE">EUNE — Europe Nordic East</option>
                  <option value="NA">NA — North America</option>
                  <option value="KR">KR — Korea</option>
                  <option value="BR">BR — Brazil</option>
                  <option value="LAN/LAS">LAN/LAS — Latin America</option>
                  <option value="OCE">OCE — Oceania</option>
                  <option value="TR">TR — Turkey</option>
                  <option value="JP">JP — Japan</option>
                  <option value="ME/SEA">ME/SEA — Middle East & Southeast Asia</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                    <Users className="w-3 h-3 text-[#00d4ff]" /> Team Size *
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value as any)}
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-2 sm:px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00d4ff]/50"
                  >
                    <option value="5v5">5v5 (Summoner's Rift)</option>
                    <option value="1v1">1v1 (Solo)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                    <Users className="w-3 h-3 text-green-400" /> {teamSize === '1v1' ? 'Max Players *' : 'Max Teams *'}
                  </label>
                  <select
                    value={maxTeams}
                    onChange={(e) => setMaxTeams(e.target.value)}
                    className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-2 sm:px-3 py-2.5 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00d4ff]/50"
                  >
                    <option value="8">{teamSize === '1v1' ? '8 Players' : '8 Teams'}</option>
                    <option value="16">{teamSize === '1v1' ? '16 Players' : '16 Teams'}</option>
                    <option value="32">{teamSize === '1v1' ? '32 Players' : '32 Teams'}</option>
                    <option value="64">{teamSize === '1v1' ? '64 Players' : '64 Teams'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                  <Award className="w-3 h-3 text-purple-400" /> Tournament Format *
                </label>
                <div className="p-2.5 rounded-lg border-2 bg-[#00d4ff]/10 border-[#00d4ff] text-white w-full sm:w-auto sm:inline-block">
                  <p className="font-medium text-xs mb-0.5">Single Elimination</p>
                  <p className="text-[10px] opacity-70">Lose once, you're out</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                  <Target className="w-3 h-3 text-yellow-400" /> Rank Requirement (Optional)
                </label>
                <select
                  value={rankRequirement}
                  onChange={(e) => setRankRequirement(e.target.value)}
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50"
                >
                  <option value="">No Requirement</option>
                  <option value="Iron+">Iron+</option>
                  <option value="Bronze+">Bronze+</option>
                  <option value="Silver+">Silver+</option>
                  <option value="Gold+">Gold+</option>
                  <option value="Platinum+">Platinum+</option>
                  <option value="Diamond+">Diamond+</option>
                  <option value="Master+">Master+</option>
                  <option value="Grandmaster+">Grandmaster+</option>
                  <option value="Challenger">Challenger Only</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-[#0a0e1a]/30 border border-white/10 rounded-lg p-2.5">
                <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                  <FileText className="w-3 h-3 text-[#00d4ff]" /> Tournament Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Join our epic Spring Championship!"
                  rows={2}
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff]/50 resize-none"
                />
              </div>

              <div className="bg-[#0a0e1a]/30 border border-white/10 rounded-lg p-2.5">
                <label className="flex items-center gap-1.5 text-white text-xs font-medium mb-1.5">
                  <FileText className="w-3 h-3 text-purple-400" /> Tournament Rules *
                </label>
                <textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="• Riot verified&#10;• Draft Pick only&#10;• Best of 3&#10;• No toxic behavior"
                  rows={3}
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-[11px] placeholder:text-white/40 focus:outline-none focus:border-purple-400/50 resize-none font-mono"
                />
              </div>

              {/* Prize Distribution */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5 mb-2">
                  <Trophy className="w-3 h-3 text-green-400" />
                  <h3 className="text-white font-bold text-xs">Prize Distribution *</h3>
                </div>

                <div className="bg-[#0a0e1a]/50 border border-green-500/20 rounded-lg p-2 mb-2 text-center">
                  <p className="text-white/60 text-[10px] mb-0.5">Total Prize Pool</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-400">€{parseFloat(prize || '0').toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { key: 'first', emoji: '🥇', label: '1st Place', color: 'text-yellow-400', border: 'border-yellow-500/20', focus: 'focus:border-yellow-400/50' },
                    { key: 'second', emoji: '🥈', label: '2nd Place', color: 'text-gray-300', border: 'border-gray-400/20', focus: 'focus:border-gray-400/50' },
                    { key: 'third', emoji: '🥉', label: '3rd Place', color: 'text-orange-400', border: 'border-orange-500/20', focus: 'focus:border-orange-400/50' },
                  ].map(({ key, emoji, label, color, border, focus }) => (
                    <div key={key} className={`bg-[#0a0e1a]/30 border ${border} rounded-lg p-2`}>
                      <div className="text-center mb-1.5">
                        <span className="text-lg sm:text-xl block mb-0.5">{emoji}</span>
                        <p className="text-white/60 text-[9px] sm:text-[9px]">{label}</p>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={prizeDistribution[key as keyof typeof prizeDistribution]}
                        onChange={(e) => setPrizeDistribution({ ...prizeDistribution, [key]: e.target.value })}
                        className={`w-full bg-[#0a0e1a] border border-white/10 rounded px-1 py-1 text-white text-center text-xs font-bold focus:outline-none ${focus} mb-1`}
                        placeholder="%"
                      />
                      <p className={`${color} font-bold text-center text-[11px]`}>
                        €{((parseFloat(prize || '0') * parseFloat(prizeDistribution[key as keyof typeof prizeDistribution] || '0')) / 100).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={`rounded-lg p-1.5 ${prizeTotal === 100 ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${prizeTotal === 100 ? 'text-green-400' : 'text-red-400'}`}>
                      {prizeTotal === 100 ? '✓ Perfect!' : '⚠ Must equal 100%'}
                    </span>
                    <span className={`text-base font-bold ${prizeTotal === 100 ? 'text-green-400' : 'text-red-400'}`}>{prizeTotal}%</span>
                  </div>
                </div>
              </div>

              {/* Add Prize Money */}
              <div className={`rounded-lg border-2 p-2.5 ${moneyAdded ? 'bg-green-500/10 border-green-500/50' : 'bg-yellow-500/10 border-yellow-500/50'}`}>
                {!moneyAdded ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Add Prize Money</h3>
                          <p className="text-white/60 text-[10px]">Required to create tournament</p>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <p className="text-white/60 text-[9px]">Total</p>
                        <p className="text-lg sm:text-xl font-bold text-yellow-400">€{parseFloat(prize || '0').toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
                      <p className="text-yellow-400 text-[10px] flex items-start gap-1.5">
                        <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                        <span>By adding prize money, you commit to distributing €{parseFloat(prize || '0').toFixed(2)} to winners.</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      disabled={!isStep3Valid}
                      className="w-full px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                    >
                      Add €{parseFloat(prize || '0').toFixed(2)} Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">✓ Prize Money Added!</h3>
                        <p className="text-green-400 text-xs">€{parseFloat(prize || '0').toFixed(2)} via {paymentMethod.toUpperCase()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMoneyAdded(false)}
                      className="w-full px-2.5 py-1.5 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-all text-[10px]"
                    >
                      Modify Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-white/5 bg-[#0a0e1a]/30 flex-shrink-0">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <button
              onClick={step === 1 ? onClose : () => setStep(step - 1)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white text-sm rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next Step
                </button>
              ) : (
                <>
                  {!moneyAdded ? (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      disabled={!isStep3Valid}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden xs:inline">Add </span>€{parseFloat(prize || '0').toFixed(2)}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white text-sm rounded-lg hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all duration-300 font-medium flex items-center gap-1.5"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Create Tournament</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10000] p-3 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-2xl flex flex-col border border-green-500/20 shadow-2xl shadow-green-500/10"
            style={{ maxHeight: '88dvh' }}>

            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-white/5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20 flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white">Choose Payment Method</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Select your preferred way to pay €{parseFloat(prize || '0').toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1 overscroll-contain">
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`relative p-2.5 sm:p-4 rounded-xl border-2 transition-all duration-300 group ${
                      paymentMethod === method.id ? 'shadow-lg' : 'bg-[#0a0e1a]/50 border-white/10 hover:border-white/30 hover:bg-[#0a0e1a]/80'
                    }`}
                    style={{
                      borderColor: paymentMethod === method.id ? method.color : undefined,
                      backgroundColor: paymentMethod === method.id ? `${method.color}20` : undefined,
                    }}
                  >
                    <div className={`h-8 sm:h-12 flex items-center justify-center mb-1.5 sm:mb-2 transition-all duration-300 ${
                      paymentMethod === method.id ? 'scale-110' : 'scale-100 group-hover:scale-105'
                    }`}
                      style={{ color: paymentMethod === method.id ? method.color : 'rgba(255,255,255,0.5)' }}>
                      {method.logo}
                    </div>
                    <p className={`text-[10px] sm:text-xs font-bold text-center transition-colors ${
                      paymentMethod === method.id ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                    }`}>
                      {method.name}
                    </p>
                    {paymentMethod === method.id && (
                      <div className="absolute top-1.5 right-1.5">
                        <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Details */}
              <div className="bg-[#0a0e1a]/50 border border-white/10 rounded-xl p-3 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-white/60 text-xs sm:text-sm font-medium">Payment Amount:</span>
                  <span className="text-xl sm:text-3xl font-bold text-white">€{parseFloat(prize || '0').toFixed(2)}</span>
                </div>
                <div className="space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-white/5">
                  {[
                    { label: `🥇 1st Place (${prizeDistribution.first}%)`, pct: prizeDistribution.first },
                    { label: `🥈 2nd Place (${prizeDistribution.second}%)`, pct: prizeDistribution.second },
                    { label: `🥉 3rd Place (${prizeDistribution.third}%)`, pct: prizeDistribution.third },
                  ].map(({ label, pct }) => (
                    <div key={label} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-white/50">{label}:</span>
                      <span className="text-white font-semibold">€{((parseFloat(prize || '0') * parseFloat(pct || '0')) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-white text-[10px] sm:text-xs font-semibold">Secure Payment</p>
                      <p className="text-white/50 text-[9px] sm:text-[10px]">256-bit encryption</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div>
                      <p className="text-white text-[10px] sm:text-xs font-semibold">Instant Processing</p>
                      <p className="text-white/50 text-[9px] sm:text-[10px]">Real-time verification</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Info */}
              <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-lg p-3 sm:p-4">
                <p className="text-white text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00d4ff]" /> Tournament Details
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] sm:text-xs text-white/60">
                  <p>• Name: {tournamentName}</p>
                  <p>• Format: {format}</p>
                  <p>• {teamSize === '1v1' ? 'Players' : 'Teams'}: {maxTeams} max</p>
                  <p>• Region: {region}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-6 border-t border-white/5 bg-[#0a0e1a]/30 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => { setShowPaymentModal(false); setShowPaymentForm(false); }}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all duration-200 font-medium text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentConfirmation}
                  disabled={isProcessingPayment}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-bold text-sm sm:text-lg disabled:opacity-70"
                >
                  {isProcessingPayment ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}