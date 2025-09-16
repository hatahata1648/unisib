import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share, Trash2, ZoomIn } from 'lucide-react';

interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: number;
  uniform?: string;
  filter?: string;
}

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: CapturedImage[];
  onDeleteImage: (id: string) => void;
}

export function ImageGallery({ isOpen, onClose, images, onDeleteImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<CapturedImage | null>(null);

  const downloadImage = (image: CapturedImage) => {
    const link = document.createElement('a');
    link.download = `uniform-photo-${new Date(image.timestamp).toISOString().slice(0, 19)}.jpg`;
    link.href = image.dataUrl;
    link.click();
  };

  const shareImage = async (image: CapturedImage) => {
    try {
      if (navigator.share) {
        // Web Share APIが利用可能な場合
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'uniform-photo.jpg', { type: 'image/jpeg' });
        
        await navigator.share({
          title: '制服フォトフレーム',
          text: '制服フォトフレームアプリで撮影しました！',
          files: [file]
        });
      } else {
        // Web Share APIが利用できない場合は、画像をクリップボードにコピー
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/jpeg': blob })
        ]);
        alert('画像をクリップボードにコピーしました！');
      }
    } catch (error) {
      console.error('共有に失敗しました:', error);
      // フォールバック：画像を新しいタブで開く
      window.open(image.dataUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border-b border-white/20">
          <h2 className="text-white font-medium">撮影済み画像 ({images.length})</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {images.length === 0 ? (
            <motion.div
              className="h-full flex items-center justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-white/70">
                <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Download className="w-12 h-12 text-white/50" />
                </div>
                <p className="font-medium mb-2">まだ写真がありません</p>
                <p className="text-sm">制服を選んで撮影してみましょう！</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="relative aspect-square bg-white/10 rounded-2xl overflow-hidden border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.dataUrl}
                    alt={`撮影画像 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-white text-xs font-medium">
                      {new Date(image.timestamp).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadImage(image);
                        }}
                        className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteImage(image.id);
                        }}
                        className="p-1 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="absolute inset-0 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.dataUrl}
                alt="拡大画像"
                className="max-w-full max-h-full object-contain rounded-2xl"
              />
              
              {/* Action Buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                <motion.button
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                  onClick={() => downloadImage(selectedImage)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
                  onClick={() => shareImage(selectedImage)}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share className="w-5 h-5 text-white" />
                </motion.button>
                <motion.button
                  className="p-3 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/30 hover:bg-red-500/30 transition-colors"
                  onClick={() => {
                    onDeleteImage(selectedImage.id);
                    setSelectedImage(null);
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </motion.button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}