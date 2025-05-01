"use client"
import { supabase } from '@/utils/supabaseClient'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { RECORD } from '@/app/view-code/[uid]/page';
import DesignCard from './_components/DesignCard';
import useUserAuth from '@/hooks/userAuth';
import { Loader2 } from 'lucide-react';

function Designs() {
    const { user, loading } = useUserAuth();
    const [wireframeList, setWireframeList] = useState([]);

    // Get user information on component mount
    // useEffect(() => {
    //     async function getUserData() {
    //         try {
    //             const { data: { user } } = await supabase.auth.getUser();
    //             if (user) {
    //                 console.log('User email:', user.email);
    //                 setUser(user);
    //             }
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching user:", error);
    //             setLoading(false);
    //         }
    //     }
    //     getUserData();
    // }, []);

    useEffect(() => {
        if (user) {
            GetAllUserWireframe();
            console.log("user",user);
        }
    }, [user]);

    const GetAllUserWireframe = async () => {
        try {
            const result = await axios.get('/api/wireframe-t-code?email=' + user?.email);
            console.log(result.data);
            setWireframeList(result.data);
        } catch (error) {
            console.error("Error fetching wireframes:", error);
        }
    }

    return (
        <div>
            <h2 className='font-bold text-2xl'>Wireframe & Codes</h2>
            {loading ? (
                <p className="mt-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </p>
            ) : wireframeList.length > 0 ? (
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-7 mt-10'>
                    {wireframeList.map((item, index) => (
                        <DesignCard key={index} item={item} />
                    ))}
                </div>
            ) : (
                <p className="mt-4">
                    No designs found. Create your first wireframe to get started!
                </p>
            )}
        </div>
    )
}

export default Designs