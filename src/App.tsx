import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, ToggleLeft, ToggleRight } from "lucide-react";
import { CameraView } from "./components/CameraView";
import { RealCameraView } from "./components/RealCameraView";
import { UniformOverlay } from "./components/UniformOverlay";
import { UniformSelector } from "./components/UniformSelector";
import { UserGuideMenu } from "./components/UserGuideMenu";
import { CaptureButton } from "./components/CaptureButton";
import { ImageGallery } from "./components/ImageGallery";
import { StickerSelector, StickerItem } from "./components/StickerSelector";
import { StickerOverlay, PlacedSticker } from "./components/StickerOverlay";
import { toast } from "sonner";

interface UniformItem {
  id: string;
  name: string;
  image: string;
  category: "middle" | "high";
  type: "winter" | "jumper" | "summer" | "dress";
}

interface CapturedImage {
  id: string;
  dataUrl: string;
  timestamp: number;
  uniform?: string;
  filter?: string;
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<"middle" | "high">(
    "middle"
  );
  const [selectedUniform, setSelectedUniform] = useState<UniformItem | null>(
    null
  );
  const [selectedFilter, setSelectedFilter] = useState("");
  const [isGuideMenuOpen, setIsGuideMenuOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isRealCamera, setIsRealCamera] = useState(true);
  const [showUniform, setShowUniform] = useState(true);
  const [showUniformSelector, setShowUniformSelector] = useState(true);
  const [isStickerSelectorOpen, setIsStickerSelectorOpen] = useState(false);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleSelectUniform = (uniform: UniformItem) => {
    setSelectedUniform(uniform);
  };

  // 📸 修正版 handleCapture（video + 制服 + ステッカーを合成）
  const handleCapture = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current as HTMLVideoElement;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // 1. ビデオ描画
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. 制服オーバーレイ
    if (selectedUniform?.image) {
      const uniformImg = new Image();
      uniformImg.crossOrigin = "anonymous";
      uniformImg.src = selectedUniform.image;
      await new Promise((res) => (uniformImg.onload = res));
      ctx.drawImage(uniformImg, 0, 0, canvas.width, canvas.height);
    }

    // 3. ステッカー描画
    for (const sticker of placedStickers) {
      const stickerImg = new Image();
      stickerImg.crossOrigin = "anonymous";
      stickerImg.src = sticker.imageUrl;
      await new Promise((res) => (stickerImg.onload = res));

      ctx.save();
      ctx.translate(canvas.width / 2 + sticker.x, canvas.height / 2 + sticker.y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.scale(sticker.scale, sticker.scale);

      ctx.drawImage(
        stickerImg,
        -stickerImg.width / 2,
        -stickerImg.height / 2
      );
      ctx.restore();
    }

    // 4. DataURL に変換して保存
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    const newImage: CapturedImage = {
      id: Date.now().toString(),
      dataUrl,
      timestamp: Date.now(),
      uniform: selectedUniform?.name,
      filter: selectedFilter,
    };

    setCapturedImages((prev) => [newImage, ...prev]);

    toast("写真を保存しました！", {
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    });
  };

  const handleDeleteImage = (id: string) => {
    setCapturedImages((prev) => prev.filter((img) => img.id !== id));
    toast("画像を削除しました", {
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    });
  };

  const handleCameraReady = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
    // video要素を保存（RealCameraView 内の ref を外から渡すように修正が必要）
    const video = document.querySelector("video");
    if (video) videoRef.current = video as HTMLVideoElement;
  };

  const handleSelectSticker = (sticker: StickerItem) => {
    const newPlacedSticker: PlacedSticker = {
      id: Date.now().toString(),
      stickerId: sticker.id,
      name: sticker.name,
      imageUrl: sticker.imageUrl,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    setPlacedStickers((prev) => [...prev, newPlacedSticker]);
    setIsStickerSelectorOpen(false);
    toast("ステッカーを追加しました！", {
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    });
  };

  const handleUpdateSticker = (id: string, updates: Partial<PlacedSticker>) => {
    setPlacedStickers((prev) =>
      prev.map((sticker) =>
        sticker.id === id ? { ...sticker, ...updates } : sticker
      )
    );
  };

  const handleRemoveSticker = (id: string) => {
    setPlacedStickers((prev) => prev.filter((sticker) => sticker.id !== id));
  };

  const handleResetStickers = () => {
    setPlacedStickers([]);
    toast("ステッカーをリセットしました", {
      style: {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    });
  };

  const handleInteractionStart = (id: string) => {
    setActiveInteractionId(id);
  };

  const handleInteractionEnd = () => {
    setActiveInteractionId(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Camera View */}
      {isRealCamera ? (
        <RealCameraView
          filter={selectedFilter}
          isActive={true}
          onCameraReady={handleCameraReady}
        />
      ) : (
        <CameraView filter={selectedFilter} />
      )}

      {/* Uniform Overlay */}
      <UniformOverlay
        uniformImage={selectedUniform?.image || ""}
        isVisible={!!selectedUniform && showUniform}
        isInteractionDisabled={
          activeInteractionId !== null && activeInteractionId !== "uniform"
        }
        onInteractionStart={() => handleInteractionStart("uniform")}
        onInteractionEnd={handleInteractionEnd}
      />

      {/* Sticker Overlay */}
      <StickerOverlay
        stickers={placedStickers}
        onUpdateSticker={handleUpdateSticker}
        onRemoveSticker={handleRemoveSticker}
        activeInteractionId={activeInteractionId}
        onInteractionStart={handleInteractionStart}
        onInteractionEnd={handleInteractionEnd}
      />

      {/* Top UI */}
      <div className="absolute top-0 left-0 right-0 z-40 pt-8 px-4 pb-4 safe-top">
        <div className="flex items-center justify-between">
          {/* Category Tabs */}
          <div className="flex bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
            <motion.button
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                selectedCategory === "middle"
                  ? "bg-white/30 text-white"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setSelectedCategory("middle")}
              whileTap={{ scale: 0.95 }}
            >
              中学
            </motion.button>
            <motion.button
              className={`px-6 py-3 font-medium transition-all duration-300 ${
                selectedCategory === "high"
                  ? "bg-white/30 text-white"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setSelectedCategory("high")}
              whileTap={{ scale: 0.95 }}
            >
              高校
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            {/* Camera Toggle */}
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
              onClick={() => setIsRealCamera(!isRealCamera)}
              whileTap={{ scale: 0.95 }}
            >
              {isRealCamera ? (
                <ToggleRight className="w-5 h-5 text-green-400" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-white/70" />
              )}
              <span className="text-white text-sm font-medium">
                {isRealCamera ? "ON" : "OFF"}
              </span>
            </motion.button>

            {/* User Guide Menu Button */}
            <motion.button
              className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
              onClick={() => setIsGuideMenuOpen(true)}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Uniform Selector */}
      <UniformSelector
        selectedCategory={selectedCategory}
        onSelectUniform={handleSelectUniform}
        selectedUniform={selectedUniform}
        showUniformSelector={showUniformSelector}
        onToggleUniformSelector={() => setShowUniformSelector(!showUniformSelector)}
      />

      {/* Capture Button */}
      <CaptureButton
        onCapture={handleCapture}
        onGalleryOpen={() => setIsGalleryOpen(true)}
        onStickerMenuOpen={() => setIsStickerSelectorOpen(true)}
        onResetStickers={handleResetStickers}
        capturedCount={capturedImages.length}
        hasStickers={placedStickers.length > 0}
      />

      {/* User Guide Menu */}
      <AnimatePresence>
        <UserGuideMenu
          isOpen={isGuideMenuOpen}
          onClose={() => setIsGuideMenuOpen(false)}
        />
      </AnimatePresence>

      {/* Sticker Selector */}
      <AnimatePresence>
        <StickerSelector
          isOpen={isStickerSelectorOpen}
          onClose={() => setIsStickerSelectorOpen(false)}
          onSelectSticker={handleSelectSticker}
        />
      </AnimatePresence>

      {/* Image Gallery */}
      <AnimatePresence>
        {isGalleryOpen && (
          <ImageGallery
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            images={capturedImages}
            onDeleteImage={handleDeleteImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
