import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sparkles, ShieldCheck } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  posterImage: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  posterImage,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[#171A19] text-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8BC9A5]" />
              <h3 className="font-semibold text-base">{title} - تیزر و معرفی ویدیویی</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video / Visual Simulation Canvas */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <img
              src={posterImage}
              alt={title}
              className="w-full h-full object-cover opacity-60 filter brightness-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <span className="bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-[#8BC9A5] flex items-center gap-1 border border-[#8BC9A5]/30">
                  <Volume2 className="w-3.5 h-3.5" /> صدای فضایی ۳۶۰ درجه
                </span>
              </div>
              <div className="text-right space-y-2">
                <p className="text-xs text-gray-300 font-mono">۴K ULTRA HD • HDR 10+</p>
                <h4 className="text-xl font-bold text-white">تجربه کیفیت آکوستیک بدون نویز</h4>
                <p className="text-xs text-gray-300 max-w-md">
                  تکنولوژی نویز کنسلینگ هیبریدی اختصاصی با پردازش لحظه‌ای سیگنال‌های صوتی
                </p>
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="p-4 bg-[#1F2321] flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8BC9A5]" />
              <span>گارانتی ۲۴ ماهه رسمی لوکس‌شاپ</span>
            </div>
            <button
              onClick={onClose}
              className="bg-[#8BC9A5] text-[#171A19] px-4 py-2 rounded-lg font-medium hover:bg-[#8BC9A5]/90 transition-colors"
            >
              متوجه شدم
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
