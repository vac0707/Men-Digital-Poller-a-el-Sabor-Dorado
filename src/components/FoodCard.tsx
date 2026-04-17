import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface FoodCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product, onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-white rounded-[16px] overflow-hidden pro-card-shadow group relative flex flex-row items-stretch h-32 sm:h-36 border border-white/10"
    >
      {/* Image Container */}
      <div className="relative w-32 sm:w-40 bg-gray-100 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Badge */}
        {product.tag && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`px-2 py-1 rounded-[6px] text-[8px] font-black uppercase tracking-widest shadow-lg ${
              product.tag === 'Top Ventas' || product.tag === 'Popular' 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-dark'
            }`}>
              {product.tag}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between flex-grow min-w-0">
        <div>
          <h3 className="text-sm sm:text-base font-black text-dark truncate uppercase tracking-tight">
            {product.name}
          </h3>
          <p className="text-[#686868] text-[10px] sm:text-xs line-clamp-2 leading-tight mt-1">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary font-black text-lg">
            S/{product.price.toFixed(2)}
          </span>
          <button
            onClick={() => onAdd(product)}
            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white transition-all active:scale-95 hover:bg-red-700 shadow-lg shadow-primary/20"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
