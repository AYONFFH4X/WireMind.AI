import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, UserCheck2Icon } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import useUserAuth from '@/hooks/userAuth'

const items = [
    {
        title: "Workspace",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "design",
        url: "/design",
        icon: Inbox,
    },
    {
        title: "credits",
        url: "/credits",
        icon: Calendar,
    }
]

export function AppSidebar() {
    const path = usePathname()
    const { user } = useUserAuth();
    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4 flex items-center'>
                    <Image src={'/Wiremind.png'} alt='logo' width={200} height={200}
                        className='w-10 h-10 object-contain'/>
                    <h2 className='text-lg text-black font-bold'>WireMind.AI</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>

                    <SidebarGroupContent>
                        <SidebarMenu className='mt-5'>
                            {items.map((item, index) => (
                                <a href={item.url} key={index}
                                 className={`p-2 text-lg flex gap-2 items-center
                                 hover:bg-gray-100 rounded-lg ${path === item.url && 'bg-gray-200'}`}>
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </a>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <h2 className='p-2 text-gray-400 text-md font-bold'>
                {user && user.email && (
                    <div className='flex gap-2 items-center'>
                    <UserCheck2Icon className='h-5 w-5' />
                    <p className="text-gray-600 font-semibold text-md">
                        {user.email}
                    </p>
                    </div>
                )}
                </h2>
            </SidebarFooter>
        </Sidebar>
    )
}