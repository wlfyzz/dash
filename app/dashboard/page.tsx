'use client'

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UserProfile } from "@/components/profile";
import Header from "@/components/Header";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [Greeting, setGreeting] = useState('');
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const getGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good Morning');
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good Afternoon');
      } else if (currentHour >= 17 && currentHour < 21) {
        setGreeting('Good Evening');
      } else {
        setGreeting('Good Night');
      }
    };
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      const toastId = localStorage.getItem('loginToastId');
      if (toastId) {
        toast.dismiss(toastId);
        localStorage.removeItem('loginToastId');
      }
    }
    getGreeting();
  }, [status, router]);

  const handleLogout = async () => {
    setIsLogoutDialogOpen(false);
    await signOut({ redirect: true });
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold mb-4">{Greeting} {session.user?.name} 👋</h2>
      </main>
    </div>
  );
}
