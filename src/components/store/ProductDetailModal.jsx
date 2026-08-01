import React, { useState } from 'react';
import { X, ShoppingBag, ZoomIn } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function ProductDetailModal({ product, onClose }) {
  const [imageZoomed, setImageZoomed] = useState(false);
  if (!product) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-5xl bg-card border border-border rounded-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Large product image — click to zoom */}
          <button
            onClick={() => setImageZoomed(true)}
            className="relative w-full overflow-hidden bg-muted/10 flex items-center justify-center group cursor-zoom-in"
          >
            <Image src={product.image} alt={product.name} fittingType="fit" className="w-full h-auto" />
            {product.tag && (
              <span className="absolute top-4 left-4 text-[9px] tracking-widest uppercase text-white font-bold bg-teal px-2.5 py-1 rounded-full">
                {product.tag}
              </span>
            )}
            <span className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-border flex items-center justify-center group-hover:bg-teal/30 transition-colors">
              <ZoomIn className="w-5 h-5 text-white" />
            </span>
          </button>

          {/* Description underneath */}
          <div className="p-6 md:p-10">
            <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">{product.category}</span>
            <h2 className="font-display text-2xl md:text-4xl text-white mt-2 mb-2">{product.name}</h2>
            <p className="text-2xl md:text-3xl font-bold text-teal mb-4">{product.price}</p>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{product.description}</p>

            <button className="mt-6 inline-flex items-center justify-center gap-2 bg-teal text-white font-bold text-sm tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-teal/90 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen image zoom */}
      {imageZoomed && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 animate-fade-in"
          onClick={() => setImageZoomed(false)}
        >
          <button
            onClick={() => setImageZoomed(false)}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={product.image}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}