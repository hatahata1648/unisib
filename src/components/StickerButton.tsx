import React from 'react';
import { motion } from 'motion/react';
import { Sticker } from 'lucide-react';

interface StickerButtonProps {
  onStickerMenuOpen: () => void;
}

export function StickerButton({ onStickerMenuOpen }: StickerButtonProps) {
  return (
    <motion.button
      className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      onClick={onStickerMenuOpen}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      <Sticker className="w-8 h-8 text-white" />
    </motion.button>
  );
}