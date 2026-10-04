import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { removeBackground } from '@imgly/background-removal'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, Download, Sparkles, RefreshCw } from 'lucide-react'

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setOriginalImage(imageUrl)
    setProcessedImage(null)
    setIsProcessing(true)
    setProgress(0)

    try {
      // Configuration for imgly background removal
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          // Calculate rough progress based on fetch/compute steps
          const percentage = Math.round((current / total) * 100)
          if (percentage > 0 && percentage <= 100) {
             setProgress(percentage)
          }
        }
      })
      
      const resultUrl = URL.createObjectURL(blob)
      setProcessedImage(resultUrl)
    } catch (error) {
      console.error("Error removing background:", error)
      alert("Failed to process image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const reset = () => {
    setOriginalImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setProgress(0)
  }

  const downloadResult = () => {
    if (!processedImage) return
    const a = document.createElement('a')
    a.href = processedImage
    a.download = 'immdremove-result.png'
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-brand-primary selection:text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 w-full max-w-4xl flex flex-col items-center"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-brand-primary" />
            immDremove
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">
            Pro-level background removal in your browser. Fast, free, and completely private.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!originalImage && (
            <motion.div 
              key="dropzone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div 
                {...getRootProps()} 
                className={`w-full h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ease-in-out group ${
                  isDragActive 
                    ? 'border-brand-primary bg-brand-primary/5 scale-[1.02]' 
                    : 'border-dark-border bg-dark-surface hover:border-brand-primary/50 hover:bg-[#151515]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="p-4 rounded-full bg-[#222] mb-4 group-hover:scale-110 transition-transform duration-300">
                  <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-brand-primary' : 'text-gray-400'}`} />
                </div>
                <p className="text-xl font-medium mb-2">
                  {isDragActive ? "Drop it here!" : "Drag & drop an image"}
                </p>
                <p className="text-sm text-gray-500">or click to browse from your device</p>
              </div>
            </motion.div>
          )}

          {originalImage && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <div className="w-full relative rounded-3xl overflow-hidden bg-dark-surface border border-dark-border shadow-2xl">
                {isProcessing ? (
                  <div className="w-full aspect-video flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-8">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="mb-6"
                    >
                      <RefreshCw className="w-12 h-12 text-brand-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold mb-2">AI is working its magic...</h3>
                    <p className="text-gray-400 mb-6 text-center max-w-md">
                      First run takes longer as the AI model is downloaded securely to your browser.
                    </p>
                    <div className="w-full max-w-xs h-2 bg-dark-border rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-brand-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : processedImage ? (
                  <div className="w-full aspect-video relative group">
                    <ReactCompareSlider
                      itemOne={<ReactCompareSliderImage src={originalImage} alt="Original" />}
                      itemTwo={
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2NjYyIvPgo8cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+CjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmZmYiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')]">
                          <ReactCompareSliderImage src={processedImage} alt="Processed" />
                        </div>
                      }
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : null}
              </div>

              {!isProcessing && processedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <button 
                    onClick={reset}
                    className="px-6 py-3 rounded-full font-medium bg-dark-surface hover:bg-[#222] border border-dark-border transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                  <button 
                    onClick={downloadResult}
                    className="px-8 py-3 rounded-full font-semibold bg-brand-primary hover:bg-brand-hover text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2 transform hover:-translate-y-1"
                  >
                    <Download className="w-5 h-5" /> Download HD
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default App
