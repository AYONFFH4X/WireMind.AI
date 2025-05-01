"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import axios from "axios";
import AppHeader from '../_components/AppHeader';
import { AppSidebar } from '../_components/AppSidebar';
import { supabase } from '@/utils/supabaseClient';

function DashboardProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
const [user, setUser] = useState<any>(null);
const [loading, setLoading] = useState(true);
     useEffect(() => {
            async function getUserData() {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        console.log('User email:', user.email);
                        setUser(user);
                    }
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    setLoading(false);
                }
            }
    
            getUserData();
        }, []);
    
    const router = useRouter();

    useEffect(() => {
        if (user) {
            checkUser();
        }
    }, [user]);
    
    const checkUser = async () => {
        try {
          if (!user?.email) throw new Error('No user data available');
          const userName = user.user_metadata.full_name || user.user_metadata.name;
          const userEmail = user?.email;
          console.log('User name:', userName);
          console.log('User email:', userEmail);
      
          const result = await axios.post('/api/user', {
            userName: userName,
            userEmail: userEmail
          });
      
          console.log('User check result:', result.data);
        } catch (error) {
          console.error('Error checking user:', error);
          router.replace('/');
        }
      };

    return (
        <div className='bg-white'>
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <AppHeader />

                {/* <SidebarTrigger /> */}
                <div className='p-10'>{children}</div>
            </main>
        </SidebarProvider>
        </div>
    )
}

export default DashboardProvider