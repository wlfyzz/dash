'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import { Toaster } from 'react-hot-toast'
import { Command } from '@/components/command'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ConditionalRender } from '@/components/conditional-render'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface RecentItem {
  id: number;
  url: string;
  title: string;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateRecentItems(pathname: string): void {
  if (pathname === "/") {
    return;
  }

  const storedItems = localStorage.getItem("recent");
  const recentItems: RecentItem[] = storedItems ? JSON.parse(storedItems) : [];

  const newItem: RecentItem = {
    id: Date.now(),
    url: pathname,
    title: capitalizeFirstLetter(pathname.split("/")[1])
  };

  const existingIndex = recentItems.findIndex(item => item.url === newItem.url);

  if (existingIndex !== -1) {
    recentItems.splice(existingIndex, 1);
  }

  recentItems.unshift(newItem);

  if (recentItems.length >2 ) {
    recentItems.pop();
  }

  localStorage.setItem("recent", JSON.stringify(recentItems));
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      updateRecentItems(pathname);
    }
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} dark bg-gray-900`}>
        <Providers>
          {children}
          <ConditionalRender excludePaths={['/']}>
            <Command />
          </ConditionalRender>
        </Providers>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}

