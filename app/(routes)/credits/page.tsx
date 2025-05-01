"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import useUserAuth from '@/hooks/userAuth'

function Credits() {
    const { user } = useUserAuth()
    const [userData, setUserData] = useState<any>();
    useEffect(() => {
        user && GetUserCredits();
    }, [user])

    const GetUserCredits = async () => {
        const result = await axios.get('/api/user', {
            params: {
                email: user?.email
            }
        });
        console.log("result", result.data)
        setUserData(result.data[0]);
    }

    return (
        <div>
            <h2 className='font-bold text-2xl'>Credits</h2>

            <div className='p-5 bg-slate-50 rounded-xl border
             flex justify-between items-center mt-6'>
                <div>
                    <h2 className='font-bold text-xl'>My Credits:</h2>
                    {userData?.credits && <p className='text-lg text-gray-500'>{userData?.credits} Credits left</p>}
                </div>
                <Button className='bg-black'>Buy More Credits</Button>
            </div>
        </div>
    )
}

export default Credits