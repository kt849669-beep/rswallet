import UserHome from '@/components/UserHome';

export const metadata = { title: 'Dashboard', description: 'Manage your RS Wallet account, UPI setup, rewards and wallet activity.', robots: { index: false, follow: false } };
export default function HomePage() { return <UserHome />; }
