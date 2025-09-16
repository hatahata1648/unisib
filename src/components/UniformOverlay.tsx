import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';

interface UniformOverlayProps {
  uniformImage: string;
  isVisible: boolean;
  isInteractionDisabled?: boolean;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

export function UniformOverlay({ uniformImage, isVisible, isInteractionDisabled = false, onInteractionStart, onInteractionEnd }: UniformOverlayProps) {
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const lastPanRef = useRef({ x: 0, y: 0 });
  const lastScaleRef = useRef(1);
  const lastRotationRef = useRef(0);

  if (!isVisible) return null;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "backOut" }}
    >
      <motion.div
        className={`cursor-move touch-none ${isInteractionDisabled ? 'pointer-events-none' : 'pointer-events-auto'}`}
        style={{
          x: transform.x,
          y: transform.y,
          scale: transform.scale,
          rotate: transform.rotation,
        }}
        drag={!isInteractionDisabled}
        dragMomentum={false}
        onDragStart={() => {
          setIsDragging(true);
          onInteractionStart?.();
        }}
        onDragEnd={() => {
          setIsDragging(false);
          onInteractionEnd?.();
        }}
        onDrag={(_, info) => {
          setTransform(prev => ({
            ...prev,
            x: prev.x + info.delta.x,
            y: prev.y + info.delta.y
          }));
        }}
        whileDrag={{ scale: transform.scale * 1.05 }}
      >
        <img
          src={uniformImage}
          alt="制服オーバーレイ"
          className="w-48 h-64 object-contain drop-shadow-lg"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            mixBlendMode: 'multiply'
          }}
          onTouchStart={(e) => {
            if (isInteractionDisabled) return;
            if (e.touches.length === 2) {
              e.preventDefault();
              onInteractionStart?.();
              const touch1 = e.touches[0];
              const touch2 = e.touches[1];
              const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
              );
              lastScaleRef.current = distance;
              
              const angle = Math.atan2(
                touch2.clientY - touch1.clientY,
                touch2.clientX - touch1.clientX
              );
              lastRotationRef.current = angle;
            }
          }}
          onTouchMove={(e) => {
            if (isInteractionDisabled) return;
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
              
              const scaleChange = distance / lastScaleRef.current;
              const rotationChange = (angle - lastRotationRef.current) * (180 / Math.PI);
              
              setTransform(prev => ({
                ...prev,
                scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange)),
                rotation: prev.rotation + rotationChange
              }));
              
              lastScaleRef.current = distance;
              lastRotationRef.current = angle;
            }
          }}
          onTouchEnd={(e) => {
            if (e.touches.length === 0) {
              onInteractionEnd?.();
            }
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
}