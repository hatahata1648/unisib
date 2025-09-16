import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import middleJumperImage from "figma:asset/4ef461f2cc9efea42b47b312c4df36e6bf900a38.png";
import middleDressImage from "figma:asset/6d28f196e43e24f07b06cf009b98b8be14f2b3e5.png";
import highDressImage from "figma:asset/6d28f196e43e24f07b06cf009b98b8be14f2b3e5.png";
import middleSummerImage from "figma:asset/385d8bab4dc71fb5221b377f673b00f2dad64c9f.png";
import middleWinterImage from "figma:asset/b9eb25f2cdab4ee1705ab23136f3b0394401f5cc.png";

import highSummerGreyImage from "figma:asset/441cf68403b0d6c2871272cc7e68022f97de4743.png";
import highSummerNavyImage from "figma:asset/903493ea04b4472997f0400ac760bfbdc7578ec8.png";
import highWinterImage from "figma:asset/7bc5f120ffdeff7550d5998148f887940cc866b6.png";

interface UniformItem {
  id: string;
  name: string;
  image: string;
  category: 'middle' | 'high';
  type: 'winter' | 'jumper' | 'summer' | 'dress';
}

interface UniformSelectorProps {
  selectedCategory: 'middle' | 'high';
  onSelectUniform: (uniform: UniformItem) => void;
  selectedUniform: UniformItem | null;
  showUniformSelector: boolean;
  onToggleUniformSelector: () => void;
}

const uniforms: UniformItem[] = [
  // 中学校制服
  {
    id: 'middle-winter',
    name: '冬服',
    image: middleWinterImage,
    category: 'middle',
    type: 'winter'
  },
  {
    id: 'middle-jumper-1',
    name: 'ジャンパースカート',
    image: middleJumperImage,
    category: 'middle',
    type: 'jumper'
  },
  {
    id: 'middle-summer-1',
    name: '夏服（セーラー）',
    image: middleSummerImage,
    category: 'middle',
    type: 'summer'
  },

  {
    id: 'middle-dress',
    name: 'ワンピース',
    image: middleDressImage,
    category: 'middle',
    type: 'dress'
  },
  
  // 高校制服
  {
    id: 'high-winter',
    name: '冬服',
    image: highWinterImage,
    category: 'high',
    type: 'winter'
  },
  {
    id: 'high-summer-1',
    name: '夏服グレー',
    image: highSummerGreyImage,
    category: 'high',
    type: 'summer'
  },
  {
    id: 'high-summer-2',
    name: '夏服紺',
    image: highSummerNavyImage,
    category: 'high',
    type: 'summer'
  },

  {
    id: 'high-dress',
    name: 'ワンピース',
    image: highDressImage,
    category: 'high',
    type: 'dress'
  }
];

export function UniformSelector({ 
  selectedCategory, 
  onSelectUniform, 
  selectedUniform, 
  showUniformSelector, 
  onToggleUniformSelector 
}: UniformSelectorProps) {
  const filteredUniforms = uniforms.filter(uniform => uniform.category === selectedCategory);
  


  return (
    <motion.div
      className="absolute bottom-32 left-0 right-0 px-4 pb-4 safe-bottom"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <div className="flex justify-center mb-2">
        <motion.button
          className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-colors"
          onClick={onToggleUniformSelector}
          whileTap={{ scale: 0.95 }}
        >
          {showUniformSelector ? (
            <ChevronDown className="w-4 h-4 text-white" />
          ) : (
            <ChevronUp className="w-4 h-4 text-white" />
          )}
        </motion.button>
      </div>

      {/* Uniform List */}
      <AnimatePresence>
        {showUniformSelector && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
              {filteredUniforms.map((uniform, index) => (
                <motion.button
                  key={uniform.id}
                  className={`flex-shrink-0 relative overflow-hidden rounded-2xl backdrop-blur-md border border-white/20 transition-all duration-300 ${
                    selectedUniform?.id === uniform.id
                      ? 'bg-white/30 scale-105 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  style={{ width: '100px', height: '130px' }}
                  onClick={() => onSelectUniform(uniform)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={uniform.image}
                    alt={uniform.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white text-sm font-medium drop-shadow-lg">
                      {uniform.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}