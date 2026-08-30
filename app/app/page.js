import Image from 'next/image';

export const metadata = {
  title: 'RS Wallet Official App | Download APK, USDT Rate & UPI',
  description: 'Download the official RS Wallet app. Check live USDT to INR rates, fast UPI withdrawals, and 24/7 customer support. 100% genuine earning & exchange platform.',
  keywords: [
    'RS Wallet app download', 'rs wallet apk download', 'rs wallet real or fake',
    'rs wallet withdrawal problem', 'rs wallet withdrawal kaise kare', 
    'rs wallet earning app', 'rs wallet login', 'rs wallet customer care number',
    'RS Wallet USDT rate', 'Rs wallet UPI'
  ],
  alternates: {
    canonical: '/app',
  },
};

export default function AppPage() {
  const referLink = 'https://app-web.rswallet-api.com/regist?code=0ealuckpa2yv';

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white pb-20">
      
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="RS Wallet Logo" width={40} height={40} className="rounded-xl" />
            <span className="font-bold text-xl tracking-tight text-white">RS Wallet</span>
          </div>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition">Login</a>
            <a href={referLink} className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-lg hover:opacity-90 transition">Register Now</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 blur-[100px] rounded-full -z-10" />
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            Official India Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
            Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Crypto & Rupee</span> Wallet
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Welcome to the <strong>RS Wallet official website</strong>. Enjoy the best <strong>RS Wallet USDT rate</strong>, instant <strong>Rs Wallet UPI</strong> withdrawals, and a secure trading environment.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a href={referLink} className="px-6 py-3 font-semibold bg-white text-black rounded-xl hover:bg-gray-100 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Get Started (Earn Bonus)
            </a>
            <a href="#download" className="px-6 py-3 font-medium border border-gray-700 rounded-xl hover:bg-gray-900 transition flex items-center gap-2 text-white">
              ↓ RS Wallet APK Download
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent blur-2xl rounded-3xl" />
          <Image 
            src="/screenshots/dashboard.jpg" 
            alt="RS Wallet App Dashboard Preview" 
            width={400} 
            height={800} 
            className="relative z-10 rounded-3xl border-4 border-gray-800 shadow-2xl"
            unoptimized
          />
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">See How It Works</h2>
          <p className="text-gray-400 mb-10">Watch our quick guide on deposits, withdrawals, and team earnings.</p>
          <div className="aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/f0DslKbpIlc?si=j8F_lIqdIYCmExNn" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="download" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Why Traders Choose RS Wallet</h2>
          <p className="text-gray-400 mt-3">The ultimate <strong>rs wallet earning app</strong> built for fast and secure transactions.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center">
            <Image src="/screenshots/team.jpg" alt="RS Wallet Team Commission" width={200} height={400} className="rounded-xl mb-6 mx-auto border border-gray-700 shadow-lg" unoptimized />
            <h3 className="text-xl font-bold mb-2 text-white">Team Commissions</h3>
            <p className="text-gray-400 text-sm">Earn massive rewards by building your team. Real-time tracking of team recharges and commissions.</p>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center">
            <Image src="/screenshots/auth.jpg" alt="RS Wallet Google Authenticator" width={200} height={400} className="rounded-xl mb-6 mx-auto border border-gray-700 shadow-lg" unoptimized />
            <h3 className="text-xl font-bold mb-2 text-white">Bank-Grade Security</h3>
            <p className="text-gray-400 text-sm">With built-in Google Authentication, your funds are 100% safe. Don't worry about <strong>rs wallet real or fake</strong> rumors; we are verified.</p>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 text-center">
            <Image src="/screenshots/profile.jpg" alt="RS Wallet Profile and Settings" width={200} height={400} className="rounded-xl mb-6 mx-auto border border-gray-700 shadow-lg" unoptimized />
            <h3 className="text-xl font-bold mb-2 text-white">Instant Withdrawals</h3>
            <p className="text-gray-400 text-sm">Facing an <strong>rs wallet withdrawal problem</strong>? Not here. Get your INR settled instantly to your bank or UPI.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          <details className="group bg-gray-900/50 rounded-xl border border-gray-800 p-5 cursor-pointer">
            <summary className="font-semibold text-lg text-white">How to complete the RS Wallet app download?</summary>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              To get the official app, click on the Register Now button, create your account, and you will see the <strong>rs wallet apk download</strong> link on your dashboard.
            </p>
          </details>

          <details className="group bg-gray-900/50 rounded-xl border border-gray-800 p-5 cursor-pointer">
            <summary className="font-semibold text-lg text-white">Is RS Wallet real or fake?</summary>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              RS Wallet is a 100% genuine and trusted platform used by thousands of traders. We provide transparent <strong>RS Wallet USDT rates</strong> and secure settlements.
            </p>
          </details>

          <details className="group bg-gray-900/50 rounded-xl border border-gray-800 p-5 cursor-pointer">
            <summary className="font-semibold text-lg text-white">How to fix an RS Wallet withdrawal problem?</summary>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              If you ever face an <strong>rs wallet withdrawal problem</strong>, ensure your <strong>RS wallet UPI</strong> is bound correctly. Withdrawals are usually processed instantly.
            </p>
          </details>

          <details className="group bg-gray-900/50 rounded-xl border border-gray-800 p-5 cursor-pointer">
            <summary className="font-semibold text-lg text-white">What is the RS Wallet customer care number?</summary>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              For any queries, our <strong>rs wallet customer care number</strong> and support team can be reached directly via the Telegram link inside the app dashboard.
            </p>
          </details>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Ready to start earning?</h2>
        <a href={referLink} className="inline-block px-8 py-4 font-bold text-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-xl hover:scale-105 transition transform shadow-lg shadow-orange-500/25">
          Create Account Now
        </a>
      </section>
      
    </div>
  );
}
