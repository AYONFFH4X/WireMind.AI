"use client"

import { type ChangeEvent, useEffect, useState } from "react"
import { CloudUpload, WandSparkles, X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "../../../../utils/supabaseClient"
import axios from "axios"
import uuid4 from "uuid4"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Constants from "../../../../data/constant"
import useUserAuth from "@/hooks/userAuth"
import { toast } from "sonner" 

const ImageUploadr = () => {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<any>()
  const [model, setModel] = useState<string>()
  const [description, setDescription] = useState<string>()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useUserAuth()
  const [hasShownCreditToast, setHasShownCreditToast] = useState(false)

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
      setUserData(result.data[0]);
      
      // Check if user has no credits and show toast notification
      if (result.data[0]?.credits === 0 && !hasShownCreditToast) {
        toast.error(
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">No credits remaining</p>
              <p className="text-sm text-gray-500">Please purchase more credits to continue using this feature.</p>
            </div>
          </div>,
          {
            duration: 5000,
            position: "top-center",
          }
        );
        setHasShownCreditToast(true);
      }
  }

  const onChangeSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files
    if (!file) return
    const imageUrl = URL.createObjectURL(file[0])
    setPreview(imageUrl)
    setFile(file[0])
    setError(null)
  }

  const onConvertToCodeButtonClick = async () => {
    if (!file) {
      setError("Please upload an image file")
      return
    }
    
    if (!model) {
      setError("Please select an AI model")
      return
    }
    
    if (!description) {
      setError("Please enter a description")
      return
    }
    
    // Check if user has credits before proceeding
    if (userData?.credits === 0) {
      setError("You have no credits remaining. Please purchase more credits to continue.")
      toast.error(
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">No credits remaining</p>
            <p className="text-sm text-gray-500">Please purchase more credits to continue using this feature.</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: "top-center",
        }
      );
      return
    }
    
    setIsUploading(true)
    setError(null)

    try {
      const fileName = Date.now() + ".png"

      const { data, error: uploadError } = await supabase.storage.from("wireframe").upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        setError("Failed to upload image: " + uploadError.message)
        setIsUploading(false)
        return
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("wireframe").getPublicUrl(fileName)

      console.log("Upload successful:", publicUrlData.publicUrl)

      const uid = uuid4()
      const res = await axios.post("/api/wireframe-t-code", {
        uid: uid,
        description: description,
        model: model,
        imageUrl: publicUrlData.publicUrl,
        email: user?.email
      })
      
      console.log("Response:", res.data)
      setIsUploading(false)
      router.push('/view-code/' + uid)
    } catch (error: any) {
      console.error("Process error:", error)
      setError("Failed to process your request: " + (error.message || "Unknown error"))
      setIsUploading(false)
    } 
  }

  return (
    <div className="mt-10">
      {userData?.credits === 0 && (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800">No credits remaining</p>
              <p className="text-sm text-amber-600">Please purchase more credits to use this feature.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600"
        >
          {error}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-7 border rounded-xl border-dashed bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300"
          >
            <div className="p-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CloudUpload className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-semibold mt-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Upload Wireframe
            </h2>
            <p className="text-sm mt-2 text-center text-black">
              Click the button below to select your wireframe image
            </p>
            <div className="mt-6">
              <label htmlFor="select-image" className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative px-6 py-3 bg-white rounded-md border border-purple-200 group-hover:translate-y-[-2px] transition-all duration-300">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
                    Select Image
                  </span>
                </div>
                <input
                  onChange={onChangeSelect}
                  multiple={false}
                  type="file"
                  id="select-image"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative p-5 border border-dashed rounded-xl overflow-hidden bg-white shadow-lg"
          >
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors duration-300"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 pointer-events-none"></div>
              <Image
                src={preview}
                alt="preview"
                width={500}
                height={500}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-7 border rounded-xl border-dashed bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Select AI model
          </h2>
          <Select onValueChange={(value) => setModel(value)}>
            <SelectTrigger className="w-full bg-white border-purple-200 focus:ring-purple-500 transition-all duration-300 text-black">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="border-purple-200">
              {Constants?.AiModelList?.map((model, index) => (
                <SelectItem
                  key={index}
                  value={model.name}
                  className="hover:bg-purple-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                      <Image src={model.icon || "/placeholder.svg"} alt={model.name} width={25} height={25} />
                    </div>
                    <h2 className="text-black">{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <h2 className="text-lg font-semibold mt-6 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Enter description
          </h2>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full h-32 border-purple-200 rounded-lg focus:border-purple-400 focus:ring-purple-400 transition-all duration-300 bg-white resize-none text-black"
            placeholder="Describe your wireframe and what you want to generate..."
          />
          
          {userData?.credits !== undefined && (
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Credits remaining:
              </span>
              <span className={`font-medium ${userData.credits === 0 ? 'text-red-500' : 'text-green-600'}`}>
                {userData.credits}
              </span>
            </div>
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 flex items-center justify-center"
      >
        <Button
          onClick={onConvertToCodeButtonClick}
          disabled={isUploading || !file || !model || !description || userData?.credits === 0}
          className="relative group overflow-hidden rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-700 group-hover:to-blue-700 transition-all duration-300"></div>
          <div className="relative px-8 py-3 flex items-center gap-2 font-medium text-white">
            {isUploading ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <WandSparkles className="h-5 w-5 animate-pulse" />
                <span>Generate Code</span>
              </>
            )}
          </div>
        </Button>
      </motion.div>
    </div>
  )
}

export default ImageUploadr