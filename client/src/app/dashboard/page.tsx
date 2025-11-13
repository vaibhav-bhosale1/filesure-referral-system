'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

// Import our new components
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ReferralLink } from '@/components/dashboard/ReferralLink';
import { Button } from '../../components/ui/button';

// Icons for Stat Cards
const UsersIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CheckIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const CreditIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

// Define the shape of our dashboard data
interface DashboardData {
  totalReferredUsers: number;
  convertedUsers: number;
  totalCreditsEarned: number;
  referralLink: string;
}

function DashboardPage() {
  const router = useRouter();
  
  // Get store values directly - no custom hooks
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Could not fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const response = await api.post('/purchase');
      toast.success(response.data.message);
      
      // Refetch data to show updated credits
      const dashboardResponse = await api.get('/dashboard');
      setData(dashboardResponse.data);

    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Purchase failed.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Failed to load data.</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.email}
          </h1>
          <p className="text-gray-400">Your referral dashboard is ready.</p>
        </div>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Logout
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Referred Users"
          value={data.totalReferredUsers}
          icon={<UsersIcon />}
        />
        <StatCard
          title="Converted Users (Purchased)" 
          value={data.convertedUsers}
          icon={<CheckIcon />}
        />
        <StatCard
          title="Total Credits Earned"
          value={data.totalCreditsEarned}
          icon={<CreditIcon />}
        />
      </div>

      {/* Referral Link & Purchase */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReferralLink link={data.referralLink} />
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-lg border border-border bg-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground">
            Simulate a Purchase
          </h3>
          <p className="mb-4 mt-1 text-sm text-gray-400">
            Click this button to simulate making your first purchase. If you were
            referred, this will grant you and your referrer 2 credits.
          </p>
          <Button
            onClick={handlePurchase}
            isLoading={isPurchasing}
            className="w-full"
          >
            Simulate First Purchase
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Wrap the page with our ProtectedLayout
export default function ProtectedDashboardPage() {
  return (
    <ProtectedLayout>
      <DashboardPage />
    </ProtectedLayout>
  );
}