import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Star, ArrowLeft, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onSelectCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products.slice(0, 4);
    const query = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E2E7E3]"
        >
          {/* Search Input Bar */}
          <div className="p-4 border-b border-[#E2E7E3] flex items-center gap-3 bg-[#F7F7F2]">
            <Search className="w-5 h-5 text-[#6B756F]" />
            <input
              type="text"
              autoFocus
              placeholder="جستجوی محصول، ساعت هوشمند، هدفون، عطر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-base text-[#171A19] placeholder-[#6B756F] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-[#6B756F] hover:text-[#171A19]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="بستن جستجو"
              title="بستن جستجو"
              className="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Category Tags */}
          <div className="px-5 py-3 border-b border-[#E2E7E3] flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[#6B756F] flex items-center gap-1 font-medium whitespace-nowrap">
              <Tag className="w-3.5 h-3.5" /> دسترسی سریع:
            </span>
            <button
              onClick={() => {
                onSelectCategory('headphones');
                onClose();
              }}
              className="px-3 py-1 bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] rounded-full whitespace-nowrap transition-colors"
            >
              هدفون و هندزفری
            </button>
            <button
              onClick={() => {
                onSelectCategory('smartwatch');
                onClose();
              }}
              className="px-3 py-1 bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] rounded-full whitespace-nowrap transition-colors"
            >
              ساعت هوشمند
            </button>
            <button
              onClick={() => {
                onSelectCategory('perfume');
                onClose();
              }}
              className="px-3 py-1 bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] rounded-full whitespace-nowrap transition-colors"
            >
              عطر و ادکلن
            </button>
            <button
              onClick={() => {
                onSelectCategory('accessories');
                onClose();
              }}
              className="px-3 py-1 bg-[#F7F7F2] hover:bg-[#8BC9A5]/20 text-[#2F6B5B] rounded-full whitespace-nowrap transition-colors"
            >
              اکسسوری
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold text-[#6B756F] px-2 mb-2">
              {searchTerm ? `نتایج جستجو (${filteredProducts.length})` : 'پیشنهادات برگزیده'}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-[#6B756F]">
                <p>هیچ محصولی با این عبارت یافت نشد.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F7F7F2] cursor-pointer transition-colors border border-transparent hover:border-[#E2E7E3] group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-lg p-1.5 border border-[#E2E7E3] flex-shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171A19] group-hover:text-[#2F6B5B] transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#6B756F] line-clamp-1 mt-0.5">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[#6B756F] flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {product.rating}
                        </span>
                        <span className="text-[11px] text-gray-300">•</span>
                        <span className="text-[11px] text-[#2F6B5B] bg-[#8BC9A5]/20 px-1.5 py-0.5 rounded">
                          {product.sku}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#2F6B5B]">
                        {formatPrice(product.price)}{' '}
                        <span className="text-xs font-normal text-[#6B756F]">تومان</span>
                      </div>
                      {product.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </div>
                      )}
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-[#2F6B5B] group-hover:-translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
