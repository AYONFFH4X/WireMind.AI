"use client"

import React, { useEffect, useState } from 'react'
import ImageUploadr from './_components/ImageUploadr'
import ProtectedRoute from '@/app/_components/Protectedoute';
import useUserAuth from '@/hooks/userAuth';
import axios from 'axios';

function Dashboard() {


  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome to your Dashboard
            </h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              Convert Wireframe into Code
            </h2>
            <ImageUploadr />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard