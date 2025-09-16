import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import stickerImage1 from 'figma:asset/828832922c40c7690700eb7c62473a3a576dc032.png';
import stickerImage2 from 'figma:asset/3bfe91a792f6fc92f319fd0da9b078280565afa6.png';
import stickerImage3 from 'figma:asset/23dc29f1ce865f6d795d90686e9e6a2f408e1231.png';

export interface StickerItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface StickerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (sticker: StickerItem) => void;
}

const defaultStickers: StickerItem[] = [
  {
    id: 'sticker1',
    name: '聖母学院エンブレム',
    imageUrl: stickerImage1,
  },
  {
    id: 'sticker2',
    name: 'ホワイトエンブレム',
    imageUrl: stickerImage2,
  },
  {
    id: 'sticker3',
    name: '学校名ロゴ',
    imageUrl: stickerImage3,
  },
];

export function StickerSelector({ isOpen, onClose, onSelectSticker }: StickerSelectorProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          className="absolute bottom-32 left-4 right-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 max-h-80 overflow-y-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "backOut" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium text-lg">ステッカーを選択</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          {/* Sticker Grid */}
          <div className="grid grid-cols-3 gap-4">
            {defaultStickers.map((sticker, index) => (
              <motion.button
                key={sticker.id}
                className="aspect-square rounded-2xl bg-white/5 hover:bg-white/10 transition-colors overflow-hidden border border-white/10 p-3 flex items-center justify-center"
                onClick={() => onSelectSticker(sticker)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                />
              </motion.button>
            ))}
          </div>
          
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20">
            <p className="text-white text-center text-sm">
              聖母学院のオリジナルステッカーで写真を装飾しよう！
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}