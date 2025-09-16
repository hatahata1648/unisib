import React from 'react';

interface CameraViewProps {
  filter: string;
}

export function CameraView({ filter }: CameraViewProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden">
      {/* Mock camera view background */}
      <div 
        className={`w-full h-full bg-gradient-to-br from-slate-300 to-slate-500 ${filter}`}
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      >
        {/* Mock person silhouette */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-64 bg-black/20 rounded-t-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
}