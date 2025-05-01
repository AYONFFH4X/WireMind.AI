"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserAuth from '@/hooks/userAuth'

export default function ProtectedRoute({ children }: { children: any }) {
  const { user, loading, isAuthenticated } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after we've checked auth status and confirmed user is not authenticated
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If authenticated, render the children
  return isAuthenticated ? children : null;
}