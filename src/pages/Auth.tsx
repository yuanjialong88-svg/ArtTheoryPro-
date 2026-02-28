import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, CheckCircle2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Auth() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc || null);
  }, [webcamRef]);

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate verification delay
    setTimeout(() => {
      setIsVerifying(false);
      localStorage.setItem("isAuthenticated", "true");
      if (imgSrc) {
        localStorage.setItem("userAvatar", imgSrc);
      }
      navigate("/");
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-art-bg p-6 max-w-md mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-serif font-semibold text-art-primary mb-3">
          ArtTheory<span className="text-art-accent italic">Pro</span>
        </h1>
        <p className="text-art-secondary font-serif text-lg italic">
          "艺术是情感的客观化。"
        </p>
        <p className="text-art-muted text-sm mt-2">
          请进行面部识别以登录您的专属学习空间
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-art-surface shadow-2xl mb-8 bg-art-border flex items-center justify-center"
      >
        {!imgSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full h-full object-cover"
            disablePictureInPicture={true}
            forceScreenshotSourceSize={false}
            imageSmoothing={true}
            mirrored={false}
            onUserMedia={() => {}}
            onUserMediaError={() => {}}
            screenshotQuality={0.92}
          />
        ) : (
          <img src={imgSrc} alt="Captured" className="w-full h-full object-cover" />
        )}
        
        {/* Decorative corner markers */}
        <div className="absolute inset-0 border-[1px] border-dashed border-white/30 rounded-full m-2 pointer-events-none" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        {!imgSrc ? (
          <button
            onClick={capture}
            className="flex items-center justify-center gap-2 bg-art-primary text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-art-primary/90 transition-all active:scale-95"
          >
            <Camera size={20} />
            <span>拍摄面部照片</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex items-center justify-center gap-2 bg-art-primary text-white py-4 rounded-2xl font-medium shadow-lg hover:bg-art-primary/90 transition-all active:scale-95 disabled:opacity-70"
            >
              {isVerifying ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <RefreshCw size={20} />
                </motion.div>
              ) : (
                <CheckCircle2 size={20} />
              )}
              <span>{isVerifying ? "验证中..." : "确认身份"}</span>
            </button>
            <button
              onClick={() => setImgSrc(null)}
              disabled={isVerifying}
              className="flex items-center justify-center gap-2 bg-art-surface text-art-primary border border-art-border py-4 rounded-2xl font-medium hover:bg-art-border/50 transition-all active:scale-95 disabled:opacity-70"
            >
              <RefreshCw size={20} />
              <span>重新拍摄</span>
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
