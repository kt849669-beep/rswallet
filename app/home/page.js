import UserHome from '@/components/UserHome';

export const metadata = { title: 'RsWallet Dashboard', description: 'Manage your RsWallet account, UPI setup, rewards and wallet activity.', robots: { index: false, follow: false } };
export default function HomePage() { return <UserHome />; }
