import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Heart } from 'lucide-react';
import { Category, Product } from '../types';
import { formatPrice } from '../data';

interface CategoriesViewProps {
  categories: Category[];
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 space-y-12">
      {/* Category header */}
      <div className="text-right space-y-2">
        <h1 className="text-2xl md:text-3xl font-black text-[#171A19]">
          دسته‌بندی‌ها و کالاهای لوکس
        </h1>
        <p className="text-sm text-[#6B756F]">
          انتخاب آسان از بین شاخه‌های تخصصی صوتی، اکسسوری، دیجیتال و عطر
        </p>
      </div>

      {/* Category Hero Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'all' : cat.slug)}
              className={`group relative overflow-hidden rounded-2xl bg-white aspect-square shadow-sm transition-all duration-500 cursor-pointer border-2 ${
                isSelected
                  ? 'border-[#2F6B5B] ring-4 ring-[#8BC9A5]/30 shadow-lg'
                  : 'border-[#E2E7E3] hover:border-gray-400'
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-4 right-4 left-4 text-right">
                <h3 className="text-white text-base md:text-lg font-bold">{cat.name}</h3>
                <span className="text-xs text-[#8BC9A5] font-medium">
                  {cat.itemCount} کالای موجود
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter and Products Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E7E3] pb-4">
          <h2 className="text-lg font-bold text-[#171A19]">
            {selectedCategory === 'all'
              ? 'تمامی محصولات'
              : `محصولات دسته ${categories.find((c) => c.slug === selectedCategory)?.name}`}
            <span className="text-xs font-normal text-[#6B756F] mr-2">
              ({filteredProducts.length} کالا)
            </span>
          </h2>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-[#2F6B5B] font-bold hover:underline"
            >
              نمایش همه دسته‌ها
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isFavorited = wishlistIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-[#E2E7E3] hover:border-[#2F6B5B] hover:shadow-lg transition-all flex flex-col justify-between group relative"
              >
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`absolute top-6 left-6 z-10 p-2 rounded-full shadow backdrop-blur transition-colors ${
                    isFavorited
                      ? 'bg-[#BA1A1A] text-white'
                      : 'bg-white/80 text-[#6B756F] hover:text-[#BA1A1A]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
                </button>

                <div
                  onClick={() => onSelectProduct(product)}
                  className="aspect-square bg-[#F7F7F2] rounded-xl p-4 flex items-center justify-center cursor-pointer overflow-hidden mb-3"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[11px] text-[#6B756F] mb-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{product.rating}</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="font-bold text-sm text-[#171A19] group-hover:text-[#2F6B5B] transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-[#6B756F] line-clamp-1 mt-1">
                    {product.shortDescription}
                  </p>

                  <div className="text-sm font-bold text-[#2F6B5B] mt-2 mb-3">
                    {formatPrice(product.price)}{' '}
                    <span className="text-xs font-normal text-[#6B756F]">تومان</span>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, product.colors[0]?.name)}
                    className="w-full bg-[#8BC9A5] hover:bg-[#2F6B5B] text-[#171A19] hover:text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>افزودن به سبد</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
