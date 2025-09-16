import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

export interface PlacedSticker {
  id: string;
  stickerId: string;
  name: string;
  imageUrl: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface StickerOverlayProps {
  stickers: PlacedSticker[];
  onUpdateSticker: (id: string, updates: Partial<PlacedSticker>) => void;
  onRemoveSticker: (id: string) => void;
  activeInteractionId?: string | null;
  onInteractionStart?: (id: string) => void;
  onInteractionEnd?: () => void;
}

export function StickerOverlay({ 
  stickers, 
  onUpdateSticker, 
  onRemoveSticker, 
  activeInteractionId, 
  onInteractionStart, 
  onInteractionEnd 
}: StickerOverlayProps) {
  const [draggedStickerId, setDraggedStickerId] = useState<string | null>(null);
  const lastScaleRef = useRef<{ [key: string]: number }>({});
  const lastRotationRef = useRef<{ [key: string]: number }>({});

  const handleTouchStart = (e: React.TouchEvent, sticker: PlacedSticker) => {
    const isThisStickerDisabled = activeInteractionId !== null && activeInteractionId !== sticker.id;
    if (isThisStickerDisabled) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      onInteractionStart?.(sticker.id);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      lastScaleRef.current[sticker.id] = distance;
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      );
      lastRotationRef.current[sticker.id] = angle;
    }
  };

  const handleTouchMove = (e: React.TouchEvent, sticker: PlacedSticker) => {
    const isThisStickerDisabled = activeInteractionId !== null && activeInteractionId !== sticker.id;
    if (isThisStickerDisabled) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      );
      
      const lastScale = lastScaleRef.current[sticker.id];
      const lastRotation = lastRotationRef.current[sticker.id];
      
      if (lastScale && lastRotation !== undefined) {
        const scaleChange = distance / lastScale;
        const rotationChange = (angle - lastRotation) * (180 / Math.PI);
        
        onUpdateSticker(sticker.id, {
          scale: Math.max(0.5, Math.min(3, sticker.scale * scaleChange)),
          rotation: sticker.rotation + rotationChange
        });
        
        lastScaleRef.current[sticker.id] = distance;
        lastRotationRef.current[sticker.id] = angle;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, sticker: PlacedSticker) => {
    if (e.touches.length === 0) {
      onInteractionEnd?.();
    }
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {stickers.map((sticker) => {
        const isThisStickerDisabled = activeInteractionId !== null && activeInteractionId !== sticker.id;
        
        return (
          <motion.div
            key={sticker.id}
            className={`absolute group ${isThisStickerDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
            style={{
              left: `calc(50% + ${sticker.x}px)`,
              top: `calc(50% + ${sticker.y}px)`,
              transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: sticker.scale }}
            whileHover={!isThisStickerDisabled ? { scale: sticker.scale * 1.05 } : {}}
            drag={!isThisStickerDisabled}
            dragMomentum={false}
            onDragStart={() => {
              setDraggedStickerId(sticker.id);
              onInteractionStart?.(sticker.id);
            }}
            onDragEnd={() => {
              setDraggedStickerId(null);
              onInteractionEnd?.();
            }}
            onDrag={(_, info) => {
              onUpdateSticker(sticker.id, {
                x: sticker.x + info.delta.x,
                y: sticker.y + info.delta.y
              });
            }}
            whileDrag={!isThisStickerDisabled ? { scale: sticker.scale * 1.1 } : {}}
          >
            {/* Sticker Image */}
            <div className="relative cursor-move touch-none">
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className="w-20 h-20 object-contain drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                }}
                onTouchStart={(e) => handleTouchStart(e, sticker)}
                onTouchMove={(e) => handleTouchMove(e, sticker)}
                onTouchEnd={(e) => handleTouchEnd(e, sticker)}
                draggable={false}
              />
              
              {/* Remove Button */}
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSticker(sticker.id);
                }}
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}