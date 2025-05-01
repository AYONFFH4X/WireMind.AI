"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogOut, User, Menu, X } from 'lucide-react'
import useUserAuth from '@/hooks/userAuth'

const Navbar = () => {
  const pathname = usePathname()
  const { user, signOut, isAuthenticated } = useUserAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Handle scroll event to add background when scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleSignOut = async () => {
    await signOut()
  }
  
  // Skip rendering on authentication pages if needed
  if (pathname === '/login' || pathname === '/signup') {
    return null
  }

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-white/90 shadow-md backdrop-blur-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="text-lg font-bold bg-black text-white px-2 py-1 rounded-l">WireMind</span>
              <span className={`text-lg font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>.AI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-black relative ${
                pathname === '/' ? 'text-gray-500 font-semibold' : scrolled ? 'text-gray-600' : 'text-gray-800'
              } after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-black after:transition-all ${
                pathname === '/' ? 'after:w-full' : 'after:w-0'
              } hover:after:w-full`}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-black relative ${
                  pathname === '/dashboard' ? 'text-gray-500 font-semibold' : scrolled ? 'text-gray-600' : 'text-gray-800'
                } after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-black after:transition-all ${
                  pathname === '/dashboard' ? 'after:w-full' : 'after:w-0'
                } hover:after:w-full`}
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  {user?.email}
                </div>
                <Button 
                  onClick={handleSignOut}
                  size="sm"
                  className="text-sm bg-transparent hover:bg-gray-100 text-gray-400 border border-gray-300 rounded-full px-4 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button 
                  size="sm"
                  className="text-sm bg-black text-white hover:bg-gray-800 rounded-full px-6 transition-colors"
                >
                  Sign In
                </Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className={`block text-sm font-medium py-2 ${
                pathname === '/' ? 'text-gray-500 font-semibold' : 'text-gray-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <Link 
                href="/dashboard" 
                className={`block text-sm font-medium py-2 ${
                  pathname === '/dashboard' ? 'text-gray-500 font-semibold' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <User className="h-4 w-4" />
                  {user?.email}
                </div>
                <Button 
                  onClick={handleSignOut}
                  className="w-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full text-sm bg-black text-white hover:bg-gray-800">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar