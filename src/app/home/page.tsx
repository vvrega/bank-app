import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/MainLayout/MainLayout';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/');
  }

  return (
    <>
      <MainLayout initialTab="home" />
    </>
  );
}
