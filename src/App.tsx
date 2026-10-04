import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { removeBackground } from '@imgly/background-removal'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, RefreshCw, Upload, Sparkles } from 'lucide-react'

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
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
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
    <div className="min-h-screen relative overflow-hidden flex flex-col font-sans">
      {/* Aesthetic Background Elements */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-cyan/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-red/10 blur-[150px] pointer-events-none" />

      {/* Header with Logo */}
      <header className="relative z-20 w-full p-6 md:p-10 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <img src="/logo.jpg" alt="immDremove Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-widest uppercase">
            immD<span className="text-neon-cyan">remove</span>
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex items-center gap-2 text-xs font-mono tracking-widest text-gray-500"
        >
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          SYSTEM_ONLINE
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 pb-20">
        <div className="w-full max-w-5xl flex flex-col items-center">
          
          {!originalImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-display font-light tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Precision Extraction
              </h2>
              <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
                AI-Powered • Local Processing • Zero Data Logging
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!originalImage ? (
              <motion.div 
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl"
              >
                <div 
                  {...getRootProps()} 
                  className={`relative w-full h-[400px] glass-panel rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group overflow-hidden ${
                    isDragActive ? 'border-neon-cyan shadow-[0_0_30px_rgba(0,229,255,0.2)]' : 'hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {/* Scanner overlay effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`p-5 rounded-full mb-6 transition-all duration-500 ${isDragActive ? 'bg-neon-cyan/20 scale-110' : 'bg-dark-border group-hover:bg-dark-border/80'}`}>
                      <Upload className={`w-10 h-10 ${isDragActive ? 'text-neon-cyan' : 'text-gray-400 group-hover:text-white'}`} />
                    </div>
                    <p className="text-2xl font-display tracking-wide mb-2">
                      {isDragActive ? "DEPLOY IMAGE" : "INITIALIZE UPLOAD"}
                    </p>
                    <p className="text-gray-500 font-mono text-sm tracking-wider">
                      DRAG & DROP OR CLICK TO BROWSE
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center gap-8"
              >
                <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden glass-panel">
                  
                  {/* Top Bar of the processing window */}
                  <div className="w-full h-10 border-b border-white/10 flex items-center px-4 justify-between bg-black/40">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-neon-red/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-neon-cyan/80" />
                    </div>
                    <div className="font-mono text-xs text-gray-500">
                      {isProcessing ? "PROCESSING_ALGORITHM_RUNNING" : "EXTRACTION_COMPLETE"}
                    </div>
                  </div>

                  <div className="w-full min-h-[500px] flex items-center justify-center relative bg-black/20">
                    {isProcessing && <div className="scan-line" />}
                    
                    {isProcessing ? (
                      <div className="flex flex-col items-center justify-center p-12">
                        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-neon-cyan opacity-80"
                          />
                          <motion.div 
                            animate={{ rotate: -360 }} 
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                            className="absolute inset-4 rounded-full border-b-2 border-l-2 border-neon-red opacity-60"
                          />
                          <Sparkles className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <h3 className="text-xl font-display tracking-widest uppercase mb-4 text-neon-cyan">
                          Extracting Subject
                        </h3>
                        
                        {/* High-tech progress bar */}
                        <div className="w-full max-w-md">
                          <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                            <span>LOADING_NEURAL_MODELS</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-dark-border overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-neon-cyan to-neon-red"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ ease: "linear" }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : processedImage ? (
                      <div className="w-full h-full">
                        <ReactCompareSlider
                          itemOne={<ReactCompareSliderImage src={originalImage} alt="Original" />}
                          itemTwo={
                            <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzIyMiIvPgo8cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMTExIi8+CjxyZWN0IHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxMTEiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMyMjIiLz4KPC9zdmc+')]">
                              <ReactCompareSliderImage src={processedImage} alt="Processed" />
                            </div>
                          }
                          className="w-full max-h-[70vh] object-contain"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>

                {!isProcessing && processedImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6"
                  >
                    <button 
                      onClick={reset}
                      className="px-6 py-3 font-mono text-sm tracking-widest uppercase text-gray-400 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Reset
                    </button>
                    <button 
                      onClick={downloadResult}
                      className="group relative px-8 py-3 font-display tracking-widest uppercase bg-transparent text-white transition-all overflow-hidden border border-neon-cyan/50 hover:border-neon-cyan shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] flex items-center gap-3"
                    >
                      <div className="absolute inset-0 bg-neon-cyan/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                      <Download className="w-5 h-5 relative z-10" /> 
                      <span className="relative z-10">Export File</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
