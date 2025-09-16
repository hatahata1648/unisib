import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Image, RotateCcw } from 'lucide-react';
import { StickerButton } from './StickerButton';

interface CaptureButtonProps {
  onCapture: () => void;
  onGalleryOpen: () => void;
  onStickerMenuOpen: () => void;
  onResetStickers: () => void;
  capturedCount: number;
  hasStickers: boolean;
}

export function CaptureButton({ onCapture, onGalleryOpen, onStickerMenuOpen, onResetStickers, capturedCount, hasStickers }: CaptureButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);
    
    // シャッター音をシミュレート（実際のアプリでは音声ファイルを再生）
    try {
      // Web Audio APIを使ってシャッター音をシミュレート
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
    
    onCapture();
    
    setTimeout(() => {
      setIsCapturing(false);
    }, 300);
  };

  return (
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-4 safe-bottom">
      {/* Gallery Button */}
      {capturedCount > 0 && (
        <motion.button
          className="relative w-14 h-14 bg-white/10 backdrop-blur-md rounded-full shadow-lg border-2 border-white/30 flex items-center justify-center"
          onClick={onGalleryOpen}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Image className="w-6 h-6 text-white" />
          {capturedCount > 0 && (
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-white text-xs font-medium">
                {capturedCount > 99 ? '99+' : capturedCount}
              </span>
            </motion.div>
          )}
        </motion.button>
      )}

      {/* Sticker Button - 左側 */}
      <StickerButton onStickerMenuOpen={onStickerMenuOpen} />
      
      {/* Capture Button */}
      <motion.button
        className="relative w-20 h-20 bg-white rounded-full shadow-lg border-4 border-white/50 backdrop-blur-md flex items-center justify-center"
        onTouchStart={handleCapture}
        onClick={handleCapture}
        disabled={isCapturing}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isCapturing ? [1, 1.1, 1] : 1,
          boxShadow: isCapturing 
            ? "0 0 30px rgba(255,255,255,0.8)" 
            : "0 8px 20px rgba(0,0,0,0.3)"
        }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          className="absolute inset-2 bg-white rounded-full flex items-center justify-center"
          animate={{
            backgroundColor: isCapturing ? "#ef4444" : "#ffffff"
          }}
          transition={{ duration: 0.1 }}
        >
          <Camera className="w-8 h-8 text-gray-600" />
        </motion.div>
        
        {isCapturing && (
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>

      {/* Reset Button - 右側 */}
      {hasStickers && (
        <motion.button
          className="w-16 h-16 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full flex items-center justify-center hover:bg-red-500/30 transition-colors"
          onClick={onResetStickers}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <RotateCcw className="w-8 h-8 text-red-400" />
        </motion.button>
      )}
    </div>
  );
}