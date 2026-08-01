import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { merchandise } from '@/data/challengeData';

export default function Store() {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="mb-10">
        <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">Shop</span>
        <h1 className="font-display text-4xl md:text-5xl text-white mt-2">Store</h1>
        <p className="text-zinc-400 text-sm mt-2 max-w-xl">Gear up with premium High Frequency equipment and apparel.</p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-teal/15 via-card to-card border border-teal/20 rounded-2xl p-8 mb-8 flex items-center justify-between">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-teal font-bold">New Drop</span>
          <h2 className="font-display text-2xl md:text-3xl text-white mt-1">BT30™ Founders Collection</h2>
          <p className="text-sm text-zinc-400 mt-1">Limited edition gear for the first wave of High Frequency athletes.</p>
        </div>
        <ShoppingBag className="w-12 h-12 text-teal/30 hidden md:block" />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {merchandise.map(product => (
          <div key={product.name} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all">
            <div className="relative aspect-square overflow-hidden">
              <Image src={product.image} alt={product.name} fittingType="fill" className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[9px] tracking-widest uppercase text-white font-bold bg-teal px-2.5 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
              <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-teal/20 transition-colors">
                <Heart className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="p-5">
              <span className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">{product.category}</span>
              <h3 className="font-bold text-white text-sm mt-1 mb-2 leading-snug">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-teal">{product.price}</span>
                <button className="text-xs font-bold tracking-wider uppercase text-white bg-teal px-4 py-2 rounded-lg hover:bg-teal/90 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Membership CTA */}
      <div className="mt-12 bg-gradient-to-br from-card to-muted/20 border border-border rounded-2xl p-8 text-center">
        <h3 className="font-display text-2xl text-white mb-2">High Frequency Membership</h3>
        <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">Unlock all programs, nutrition guides, mindset content, and exclusive member pricing.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="bg-muted/20 border border-border rounded-xl p-5 text-left min-w-[160px]">
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">Premium</p>
            <p className="text-2xl font-bold text-white mt-1">$19<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="text-xs text-zinc-500 mt-1">All programs & content</p>
          </div>
          <div className="bg-teal/5 border border-teal/30 rounded-xl p-5 text-left min-w-[160px]">
            <p className="text-[10px] tracking-widest uppercase text-teal font-bold">VIP</p>
            <p className="text-2xl font-bold text-white mt-1">$49<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="text-xs text-zinc-500 mt-1">+ Coaching & live classes</p>
          </div>
          <div className="bg-muted/20 border border-border rounded-xl p-5 text-left min-w-[160px]">
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-bold">Elite</p>
            <p className="text-2xl font-bold text-white mt-1">$199<span className="text-sm text-zinc-500">/mo</span></p>
            <p className="text-xs text-zinc-500 mt-1">1-on-1 with Mike T</p>
          </div>
        </div>
      </div>
    </div>
  );
}