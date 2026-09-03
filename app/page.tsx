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
      <section className="relative mx-auto min-h-dvh w-full max-w-[390px] overflow-hidden bg-white shadow-[0_12px_48px_rgba(0,0,0,.10)] sm:min-h-[calc(100dvh-48px)] sm:rounded-[16px]">
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
            <section className="w-full rounded-t-[20px] bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_24px_rgba(0,0,0,.08)]">
              <h2 className="text-center text-[15px] font-semibold text-[#555]">Please enter MPIN verification</h2>

              <button
                type="button"
                aria-label="Enter six digit MPIN"
                className="mt-5 grid w-full grid-cols-6 gap-2"
                onClick={() => hiddenPinInput.current?.focus()}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={index}
                    className={`grid aspect-square place-items-center rounded-[5px] bg-[#f8f8f8] text-[20px] font-semibold text-black ${index === pin.length ? 'ring-1 ring-black/15' : ''}`}
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

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    className="h-[48px] rounded-[8px] bg-[#f7f7f7] text-[27px] font-normal text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                    onClick={() => addDigit(String(digit))}
                  >
                    {digit}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="Open device keyboard"
                  className="grid h-[48px] place-items-center rounded-[8px] bg-[#f7f7f7] text-[#555]"
                  onClick={() => hiddenPinInput.current?.focus()}
                >
                  <Keyboard className="size-6" strokeWidth={1.7} />
                </button>
                <button
                  type="button"
                  className="h-[48px] rounded-[8px] bg-[#f7f7f7] text-[27px] font-normal text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                  onClick={() => addDigit('0')}
                >
                  0
                </button>
                <button
                  type="button"
                  aria-label="Delete last digit"
                  className="grid h-[48px] place-items-center rounded-[8px] bg-[#f7f7f7] text-[#555] transition active:scale-[.98] active:bg-[#eeeeee]"
                  onClick={() => setPin((current) => current.slice(0, -1))}
                >
                  <Delete className="size-6" strokeWidth={1.7} />
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
          <div role="status" className="absolute bottom-[66px] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-4 py-2 text-xs font-medium text-white shadow-lg">
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
      <header className="grid h-[58px] place-items-center border-b border-[#eeeeee]">
        <h1 className="text-[16px] font-bold tracking-[-0.02em] text-[#202124]">LOG IN</h1>
      </header>

      <form className="flex min-h-[calc(100dvh-58px)] flex-col px-4 pb-[clamp(72px,15vh,120px)] pt-[clamp(105px,16vh,125px)] sm:min-h-[calc(100dvh-106px)]" onSubmit={onSubmit}>
        <div className="space-y-[22px]">
          <label className="sr-only" htmlFor="mobile">Mobile number</label>
          <div className="flex h-[52px] items-center gap-[18px] rounded-[8px] bg-[#f8f9f9] px-5">
            <Phone aria-hidden="true" className="size-[21px] shrink-0 text-[#9d9d9d]" strokeWidth={1.8} />
            <Input
              id="mobile"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter Your Phone Number"
              className="h-full border-0 bg-transparent px-0 text-[15px] font-medium text-[#303030] shadow-none outline-none placeholder:text-[#949494] focus-visible:border-0 focus-visible:ring-0"
            />
          </div>

          <label className="sr-only" htmlFor="password">Password</label>
          <div className="flex h-[52px] items-center gap-[18px] rounded-[8px] bg-[#f8f9f9] px-5">
            <LockKeyhole aria-hidden="true" className="size-[21px] shrink-0 text-[#9d9d9d]" strokeWidth={1.8} />
            <Input
              id="password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              className="h-full border-0 bg-transparent px-0 text-[15px] font-medium text-[#303030] shadow-none outline-none placeholder:text-[#949494] focus-visible:border-0 focus-visible:ring-0"
            />
          </div>
          {muted && <p className="-mt-2 text-right text-[13px] font-medium text-[#7889ef]">Forget Password</p>}
          <p id="demo-note" className="sr-only">Demo preview. Entered details are not saved.</p>
        </div>

        <Button
          type="submit"
          disabled={phone.length !== 10 || password.length === 0}
          className="mt-auto h-[52px] w-full rounded-[8px] bg-black text-[16px] font-medium text-white hover:bg-black/85 disabled:bg-[#8e8e8e] disabled:opacity-100"
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
    <div className="min-h-dvh bg-white pb-[62px] sm:min-h-[calc(100dvh-48px)]">
      <div className="px-4 pb-5 pt-[26px]">
        <h1 className="mb-5 text-[20px] font-bold tracking-[-0.03em] text-black">RsWallet</h1>

        <div className="relative aspect-[2.46] overflow-hidden rounded-[8px] bg-black shadow-[0_4px_8px_rgba(0,0,0,.10)]">
          <img src="/rswallet-home.jpeg" alt="A must read for newbies" className="absolute left-0 top-0 w-full max-w-none -translate-y-[14%]" />
        </div>

        <section className="mt-3 grid grid-cols-2 rounded-[8px] bg-[#f7f7f7] px-4 py-4">
          <div className="border-r border-[#dddddd] pr-3">
            <h2 className="text-[12px] font-semibold">USDT Ratio</h2>
            <p className="mt-[18px] text-[16px] font-bold">1 USDT ≈ 109.5 INR</p>
            <p className="mt-0.5 text-[10px] text-[#999]">Bonus ratio: 0%</p>
          </div>
          <div className="pl-4">
            <h2 className="text-[12px] font-semibold">INR Bonus Ratio</h2>
            <p className="mt-[18px] text-[24px] font-bold">4%</p>
          </div>
        </section>

        <div className="relative mt-4 aspect-[3.98] overflow-hidden bg-[#f6d2cf]">
          <img src="/rswallet-home.jpeg" alt="Newbie reward" className="absolute left-0 top-0 w-full max-w-none -translate-y-[46.8%]" />
        </div>

        <p className="mt-[26px] text-[12px] text-[#969696]">You&apos;re not bound to UPI</p>
        <Button className="mt-3 h-[52px] w-full rounded-[8px] bg-black text-[15px] font-medium text-white hover:bg-black/85" onClick={() => showComingSoon('Bind UPI')}>
          Bind UPI Now
        </Button>

        <section className="mt-[18px] grid grid-cols-2 overflow-hidden rounded-[8px] border border-[#ededed] bg-white">
          {[
            ['Balance', '0.00'],
            ['Today Received', '0.00'],
            ['Top up Bonus', '0.00'],
            ['Team Commission', '0.00'],
          ].map(([label, value]) => (
            <button key={label} type="button" className="relative min-h-[58px] border-b border-r border-[#f0f0f0] px-3 py-2.5 text-left" onClick={() => showComingSoon(label)}>
              <span className="block text-[11px] text-[#999]">{label}</span>
              <span className="mt-0.5 block text-[13px] font-medium text-black">{value}</span>
              <ChevronRight className="absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#999]" />
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
    <div className="min-h-dvh bg-[#f7f7f7] pb-[62px] sm:min-h-[calc(100dvh-48px)]">
      <header className="flex h-[58px] items-center border-b border-[#ededed] bg-white px-3">
        <button type="button" aria-label="Back to home" className="grid size-9 place-items-center" onClick={() => navigate('home')}>
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="ml-1 text-[17px] font-bold">My Profile</h1>
      </header>

      <div className="px-4 pb-5 pt-5">
        <section className="flex items-center gap-3 rounded-[12px] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,.04)]">
          <img src="/rswallet-logo.jpeg" alt="RsWallet logo" className="size-[52px] rounded-[13px] object-cover" />
          <div>
            <h2 className="text-[16px] font-bold">RsWallet User</h2>
            <p className="mt-0.5 text-[11px] text-[#8c8c8c]">{maskedPhone}</p>
            <span className="mt-1.5 inline-flex rounded-full bg-[#fff3c4] px-2 py-0.5 text-[9px] font-semibold text-[#8b6500]">Verified demo</span>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[12px] bg-white shadow-[0_4px_14px_rgba(0,0,0,.04)]">
          {profileRows.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className="flex h-[52px] w-full items-center border-b border-[#efefef] px-4 text-left last:border-0" onClick={() => showComingSoon(label)}>
              <span className="grid size-8 place-items-center rounded-[8px] bg-[#f4f4f4]"><Icon className="size-4 text-[#505050]" /></span>
              <span className="ml-3 text-[13px] font-medium">{label}</span>
              <ChevronRight className="ml-auto size-4 text-[#aaa]" />
            </button>
          ))}
        </section>

        <button type="button" className="mt-4 flex h-[50px] w-full items-center rounded-[12px] bg-white px-4 text-left text-[#d83b3b] shadow-[0_4px_14px_rgba(0,0,0,.04)]" onClick={logout}>
          <span className="grid size-8 place-items-center rounded-[8px] bg-[#fff1f1]"><LogOut className="size-4" /></span>
          <span className="ml-3 text-[13px] font-semibold">Log out</span>
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
    <nav aria-label="Main navigation" className="absolute bottom-0 left-0 right-0 z-10 grid h-[60px] grid-cols-5 border-t border-[#ececec] bg-white/96 px-1 pb-[max(3px,env(safe-area-inset-bottom))] backdrop-blur">
      {navItems.map(({ label, icon: Icon, target }) => {
        const isActive = (label === 'Home' && active === 'home') || (label === 'Me' && active === 'profile');
        return (
          <button
            key={label}
            type="button"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] ${isActive ? 'text-black' : 'text-[#969696]'}`}
            onClick={() => (target ? navigate(target) : showComingSoon(label))}
          >
            <Icon className={`size-5 ${isActive ? 'fill-black' : ''}`} strokeWidth={isActive ? 2.4 : 2} />
            <span className={isActive ? 'font-medium' : ''}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
