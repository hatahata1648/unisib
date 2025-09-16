import React from 'react';
import { motion } from 'motion/react';
import { X, Camera, Move, RotateCcw, ZoomIn, Image, Smartphone, Settings, Sticker, Plus, Trash2 } from 'lucide-react';

interface UserGuideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideItems = [
  {
    icon: Camera,
    title: 'カメラの使い方',
    description: '撮影ボタンをタップして写真を撮影できます。シャッター音が鳴り、自動的に保存されます。',
    color: 'from-gray-400 to-gray-600'
  },
  {
    icon: Smartphone,
    title: '制服の選択',
    description: '中学・高校タブで制服を選択できます。タップして制服を変更しましょう。',
    color: 'from-gray-500 to-gray-700'
  },
  {
    icon: Move,
    title: '制服の移動',
    description: '制服をドラッグして位置を調整できます。お好みの位置に移動させましょう。',
    color: 'from-slate-400 to-slate-600'
  },
  {
    icon: ZoomIn,
    title: '制服のサイズ調整',
    description: 'ピンチ操作で制服のサイズを拡大・縮小できます。',
    color: 'from-gray-400 to-gray-500'
  },
  {
    icon: RotateCcw,
    title: '制服の回転',
    description: '2本指で制服を回転させることができます。角度を調整しましょう。',
    color: 'from-zinc-400 to-zinc-600'
  },
  {
    icon: Image,
    title: 'ギャラリー',
    description: '撮影した写真はギャラリーボタンから確認・削除できます。',
    color: 'from-slate-500 to-slate-700'
  },
  {
    icon: Settings,
    title: 'カメラ設定',
    description: 'ONボタンで実際のカメラとサンプル表示を切り替えられます。',
    color: 'from-gray-500 to-gray-600'
  },
  {
    icon: Sticker,
    title: 'ステッカー機能',
    description: 'シャッターボタンの左側のステッカーボタンから学校エンブレムなどのステッカーを追加できます。',
    color: 'from-stone-400 to-stone-600'
  },
  {
    icon: Plus,
    title: 'ステッカーの追加',
    description: 'ステッカーメニューから好きなデザインを選んでタップすると、画面中央に配置されます。',
    color: 'from-neutral-400 to-neutral-600'
  },
  {
    icon: Move,
    title: 'ステッカーの操作',
    description: 'ステッカーも制服と同じように、ドラッグで移動、ピンチで拡大縮小・回転できます。',
    color: 'from-gray-400 to-gray-500'
  },
  {
    icon: Trash2,
    title: 'ステッカーの削除',
    description: 'ステッカーをタップすると削除ボタンが表示されます。右側のリセットボタンで全てのステッカーを削除できます。',
    color: 'from-slate-400 to-slate-600'
  }
];

export function UserGuideMenu({ isOpen, onClose }: UserGuideMenuProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        className="absolute right-4 top-16 bottom-32 w-80 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "backOut" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-medium">使い方ガイド</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        
        <div className="space-y-4 overflow-y-auto max-h-full">
          {guideItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{item.title}</h4>
                    <p className="text-white/80 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-gray-500/20 to-slate-500/20 border border-white/20">
          <p className="text-white text-center text-sm">
            制服とステッカーで素敵な写真を撮影しましょう！
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}