'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImageDto } from '@/types';

interface Props {
  mainImageUrl: string;
  mainAlt: string;
  extraImages?: ProductImageDto[];
}

export default function ProductGallery({ mainImageUrl, mainAlt, extraImages = [] }: Props) {
  const allImages = [
    { id: 0, imageUrl: mainImageUrl, altText: mainAlt, description: null },
    ...extraImages.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText ?? mainAlt,
      description: img.description,
    })),
  ];

  const [active, setActive] = useState(0);
  const activeImage = allImages[active];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative w-full aspect-square bg-white/5 rounded-sm overflow-hidden">
        <Image
          key={activeImage.imageUrl}
          src={activeImage.imageUrl}
          alt={activeImage.altText}
          fill
          priority
          className="object-cover transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Description of active image */}
      {activeImage.description && (
        <p className="text-white/50 text-xs leading-relaxed px-1">
          {activeImage.description}
        </p>
      )}

      {/* Thumbnails — only show when there are extra images */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {allImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActive(idx)}
              className={`relative shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
                active === idx
                  ? 'border-accent'
                  : 'border-white/10 hover:border-white/40'
              }`}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
