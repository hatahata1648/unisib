import React, { useRef, useEffect, useState } from "react";

interface RealCameraViewProps {
  filter: string;
  isActive: boolean;
  onCameraReady: (canvas: HTMLCanvasElement) => void;
}

export function RealCameraView({ filter, isActive, onCameraReady }: RealCameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("カメラ起動エラー:", err);
      }
    };

    if (isActive) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive]);

  // video → canvas に描画
  useEffect(() => {
    const drawToCanvas = () => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      canvasRef.current.width = videoRef.current.videoWidth || 640;
      canvasRef.current.height = videoRef.current.videoHeight || 480;

      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      requestAnimationFrame(drawToCanvas);
    };

    if (isActive) {
      requestAnimationFrame(drawToCanvas);
    }
  }, [isActive]);

  useEffect(() => {
    if (canvasRef.current) {
      onCameraReady(canvasRef.current);
    }
  }, [canvasRef.current]);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover ${filter}`}
      />
      <video ref={videoRef} className="hidden" playsInline muted />
    </div>
  );
}
