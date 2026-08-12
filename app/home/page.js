import UserHome from '@/components/UserHome';

export const metadata = { title: 'ShowPay Dashboard', robots: { index: false, follow: false }, alternates: { canonical: '/home' } };
export default function HomePage() { return <UserHome />; }
