'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  CircleEllipsis,
  CreditCard,
  Delete,
  HelpCircle,
  House,
  Keyboard,
  LockKeyhole,
  LogOut,
  Phone,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Screen = 'login' | 'mpin' | 'home' | 'profile';

const navItems = [
  { label: 'Home', icon: House, target: 'home' as const },
  { label: 'Deposit', icon: CircleDollarSign },
  { label: 'UPI', icon: BriefcaseBusiness },
  { label: 'Team', icon: Users },
  { label: 'Me', icon: CircleEllipsis, target: 'profile' as const },
];

const profileRows = [
  { label: 'Wallet details', icon: WalletCards },
  { label: 'Payment methods', icon: CreditCard },
  { label: 'Security', icon: ShieldCheck },
  { label: 'Help & support', icon: HelpCircle },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [notice, setNotice] = useState('');
  const hiddenPinInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pin.length !== 6 || screen !== 'mpin') return;
    const timer = window.setTimeout(() => setScreen('home'), 260);
    return () => window.clearTimeout(timer);
  }, [pin, screen]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 1900);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const addDigit = (digit: string) => {
    setPin((current) => (current.length < 6 ? `${current}${digit}` : current));
  };

  const openMpin = (event: React.FormEvent) => {
    event.preventDefault();
    if (phone.length !== 10 || password.length === 0) return;
    setPin('');
    setScreen('mpin');
    window.setTimeout(() => hiddenPinInput.current?.focus(), 80);
  };

  const showComingSoon = (label: string) => setNotice(`${label} is coming soon`);

  return (
    <main className="min-h-dvh bg-[#ededed] sm:grid sm:place-items-start sm:py-6">
      <section className="relative mx-auto min-h-dvh w-full max-w-[590px] overflow-hidden bg-white shadow-[0_12px_48px_rgba(0,0,0,.10)] sm:min-h-[calc(100dvh-48px)] sm:rounded-[22px]">
        {(screen === 'login' || screen === 'mpin') && (
          <LoginView
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            onSubmit={openMpin}
            muted={screen === 'mpin'}
          />
        )}

        {screen === 'mpin' && (
          <div className="absolute inset-0 z-20 flex items-end bg-white/22 backdrop-blur-[1.5px]">
            <section className="w-full rounded-t-[30px] bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-8 shadow-[0_-10px_36px_rgba(0,0,0,.09)]">
              <h2 className="text-center text-[20px] font-semibold text-[#555]">Please enter MPIN verification</h2>

              <button
                type="button"
                aria-label="Enter six digit MPIN"
                className="mt-7 grid w-full grid-cols-6 gap-3"
                onClick={() => hiddenPinInput.current?.focus()}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={index}
                    className={`grid aspect-square place-items-center rounded-[8px] bg-[#f8f8f8] text-[28px] font-semibold text-black ${index === pin.length ? 'ring-2 ring-black/15' : ''}`}
                  >
                    {pin[index] ? '•' : ''}
                  </span>
                ))}
              </button>
              <input
                ref={hiddenPinInput}
                className="pointer-events-none absolute size-px opacity-0"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="MPIN"
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 6))}
              />

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="h-[72px] rounded-[13px] bg-[#f7f7f7] text-[37px] font-normal text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                    onClick={() => addDigit(String(digit))}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Open device keyboard"
                  className="grid h-[72px] place-items-center rounded-[13px] bg-[#f7f7f7] text-[#555]"
                  onClick={() => hiddenPinInput.current?.focus()}
                >
                  <Keyboard className="size-8" strokeWidth={1.7} />
                </button>
                <button
                  type="button"
                  className="h-[72px] rounded-[13px] bg-[#f7f7f7] text-[37px] font-normal text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                  onClick={() => addDigit('0')}
                >
                  0
                </button>
                <button
                  type="button"
                  aria-label="Delete last digit"
                  className="grid h-[72px] place-items-center rounded-[13px] bg-[#f7f7f7] text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                  onClick={() => setPin((current) => current.slice(0, -1))}
                >
                  <Delete className="size-8" strokeWidth={1.7} />
                </button>
              </div>
            </section>
          </div>
        )}

        {screen === 'home' && (
          <HomeView
            active="home"
            navigate={setScreen}
            showComingSoon={showComingSoon}
          />
        )}

        {screen === 'profile' && (
          <ProfileView
            phone={phone}
            navigate={setScreen}
            showComingSoon={showComingSoon}
            logout={() => {
              setPin('');
              setPassword('');
              setScreen('login');
            }}
          />
        )}

        {notice && (
          <div role="status" className="absolute bottom-[92px] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-lg">
            {notice}
          </div>
        )}
      </section>
    </main>
  );
}

function LoginView({
  phone,
  setPhone,
  password,
  setPassword,
  onSubmit,
  muted,
}: {
  phone: string;
  setPhone: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  muted: boolean;
}) {
  return (
    <div className={muted ? 'pointer-events-none opacity-55' : ''}>
      <header className="grid h-[86px] place-items-center border-b border-[#eeeeee]">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#202124]">LOG IN</h1>
      </header>

      <form className="flex min-h-[calc(100dvh-86px)] flex-col px-6 pb-8 pt-[clamp(120px,20vh,210px)] sm:min-h-[calc(100dvh-134px)]" onSubmit={onSubmit}>
        <div className="space-y-8">
          <label className="sr-only" htmlFor="mobile">Mobile number</label>
          <div className="flex h-[78px] items-center gap-7 rounded-[12px] bg-[#f8f9f9] px-8">
            <Phone aria-hidden="true" className="size-8 shrink-0 text-[#9d9d9d]" strokeWidth={1.8} />
            <Input
              id="mobile"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter Your Phone Number"
              className="h-full border-0 bg-transparent px-0 text-[18px] font-medium text-[#303030] shadow-none outline-none placeholder:text-[#949494] focus-visible:border-0 focus-visible:ring-0"
            />
          </div>

          <label className="sr-only" htmlFor="password">Password</label>
          <div className="flex h-[78px] items-center gap-7 rounded-[12px] bg-[#f8f9f9] px-8">
            <LockKeyhole aria-hidden="true" className="size-8 shrink-0 text-[#9d9d9d]" strokeWidth={1.8} />
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              className="h-full border-0 bg-transparent px-0 text-[18px] font-medium text-[#303030] shadow-none outline-none placeholder:text-[#949494] focus-visible:border-0 focus-visible:ring-0"
            />
          </div>
          {muted && <p className="-mt-2 text-right text-[17px] font-medium text-[#7889ef]">Forget Password</p>}
          <p id="demo-note" className="sr-only">Demo preview. Entered details are not saved.</p>
        </div>

        <Button
          type="submit"
          disabled={phone.length !== 10 || password.length === 0}
          className="mt-auto h-[80px] w-full rounded-[13px] bg-black text-[24px] font-medium text-white hover:bg-black/85 disabled:bg-[#8e8e8e] disabled:opacity-100"
        >
          LOG IN
        </Button>
      </form>
    </div>
  );
}

function HomeView({
  active,
  navigate,
  showComingSoon,
}: {
  active: 'home' | 'profile';
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
}) {
  return (
    <div className="min-h-dvh bg-white pb-[96px] sm:min-h-[calc(100dvh-48px)]">
      <div className="px-6 pb-8 pt-10">
        <h1 className="mb-8 text-[28px] font-bold tracking-[-0.03em] text-black">RsWallet</h1>

        <div className="relative aspect-[2.46] overflow-hidden rounded-[12px] bg-black shadow-[0_6px_12px_rgba(0,0,0,.10)]">
          <img src="/rswallet-home.jpeg" alt="A must read for newbies" className="absolute left-0 top-0 w-full max-w-none -translate-y-[14%]" />
        </div>

        <section className="mt-5 grid grid-cols-2 rounded-[12px] bg-[#f7f7f7] px-6 py-6">
          <div className="border-r border-[#dddddd] pr-4">
            <h2 className="text-[17px] font-semibold">USDT Ratio</h2>
            <p className="mt-7 text-[23px] font-bold">1 USDT ≈ 109.5 INR</p>
            <p className="mt-1 text-[14px] text-[#999]">Bonus ratio: 0%</p>
          </div>
          <div className="pl-6">
            <h2 className="text-[17px] font-semibold">INR Bonus Ratio</h2>
            <p className="mt-7 text-[34px] font-bold">4%</p>
          </div>
        </section>

        <div className="relative mt-6 aspect-[3.98] overflow-hidden bg-[#f6d2cf]">
          <img src="/rswallet-home.jpeg" alt="Newbie reward" className="absolute left-0 top-0 w-full max-w-none -translate-y-[46.8%]" />
        </div>

        <p className="mt-8 text-[17px] text-[#969696]">You&apos;re not bound to UPI</p>
        <Button className="mt-5 h-[78px] w-full rounded-[13px] bg-black text-[22px] font-medium text-white hover:bg-black/85" onClick={() => showComingSoon('Bind UPI')}>
          Bind UPI Now
        </Button>

        <section className="mt-7 grid grid-cols-2 overflow-hidden rounded-[13px] border border-[#ededed] bg-white">
          {[
            ['Balance', '0.00'],
            ['Today Received', '0.00'],
            ['Top up Bonus', '0.00'],
            ['Team Commission', '0.00'],
          ].map(([label, value]) => (
            <button key={label} type="button" className="relative min-h-[88px] border-b border-r border-[#f0f0f0] px-5 py-4 text-left" onClick={() => showComingSoon(label)}>
              <span className="block text-[15px] text-[#999]">{label}</span>
              <span className="mt-1 block text-[19px] font-medium text-black">{value}</span>
              <ChevronRight className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#999]" />
            </button>
          ))}
        </section>
      </div>

      <BottomNav active={active} navigate={navigate} showComingSoon={showComingSoon} />
    </div>
  );
}

function ProfileView({
  phone,
  navigate,
  showComingSoon,
  logout,
}: {
  phone: string;
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
  logout: () => void;
}) {
  const maskedPhone = phone ? `+91 ${phone.slice(0, 2)}••• ••${phone.slice(-3)}` : '+91 ••••• •••••';

  return (
    <div className="min-h-dvh bg-[#f7f7f7] pb-[96px] sm:min-h-[calc(100dvh-48px)]">
      <header className="flex h-[86px] items-center border-b border-[#ededed] bg-white px-5">
        <button type="button" aria-label="Back to home" className="grid size-11 place-items-center" onClick={() => navigate('home')}>
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="ml-2 text-[23px] font-bold">My Profile</h1>
      </header>

      <div className="px-5 pb-8 pt-7">
        <section className="flex items-center gap-5 rounded-[18px] bg-white p-5 shadow-[0_5px_20px_rgba(0,0,0,.04)]">
          <img src="/rswallet-logo.jpeg" alt="RsWallet logo" className="size-[76px] rounded-[20px] object-cover" />
          <div>
            <h2 className="text-[22px] font-bold">RsWallet User</h2>
            <p className="mt-1 text-[15px] text-[#8c8c8c]">{maskedPhone}</p>
            <span className="mt-2 inline-flex rounded-full bg-[#fff3c4] px-3 py-1 text-xs font-semibold text-[#8b6500]">Verified demo</span>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-[18px] bg-white shadow-[0_5px_20px_rgba(0,0,0,.04)]">
          {profileRows.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className="flex h-[72px] w-full items-center border-b border-[#efefef] px-5 text-left last:border-0" onClick={() => showComingSoon(label)}>
              <span className="grid size-10 place-items-center rounded-[12px] bg-[#f4f4f4]"><Icon className="size-5 text-[#505050]" /></span>
              <span className="ml-4 text-[17px] font-medium">{label}</span>
              <ChevronRight className="ml-auto size-5 text-[#aaa]" />
            </button>
          ))}
        </section>

        <button type="button" className="mt-6 flex h-[66px] w-full items-center rounded-[18px] bg-white px-5 text-left text-[#d83b3b] shadow-[0_5px_20px_rgba(0,0,0,.04)]" onClick={logout}>
          <span className="grid size-10 place-items-center rounded-[12px] bg-[#fff1f1]"><LogOut className="size-5" /></span>
          <span className="ml-4 text-[17px] font-semibold">Log out</span>
        </button>
      </div>

      <BottomNav active="profile" navigate={navigate} showComingSoon={showComingSoon} />
    </div>
  );
}

function BottomNav({
  active,
  navigate,
  showComingSoon,
}: {
  active: 'home' | 'profile';
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
}) {
  return (
    <nav aria-label="Main navigation" className="absolute bottom-0 left-0 right-0 z-10 grid h-[88px] grid-cols-5 border-t border-[#ececec] bg-white/96 px-2 pb-[max(5px,env(safe-area-inset-bottom))] backdrop-blur">
      {navItems.map(({ label, icon: Icon, target }) => {
        const isActive = (label === 'Home' && active === 'home') || (label === 'Me' && active === 'profile');
        return (
          <button
            key={label}
            type="button"
            className={`flex flex-col items-center justify-center gap-1 text-[12px] ${isActive ? 'text-black' : 'text-[#969696]'}`}
            onClick={() => (target ? navigate(target) : showComingSoon(label))}
          >
            <Icon className={`size-7 ${isActive ? 'fill-black' : ''}`} strokeWidth={isActive ? 2.4 : 2} />
            <span className={isActive ? 'font-medium' : ''}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
