import React from 'react';
import { Check, Image as ImageIcon } from 'lucide-react';
import { GalleryItem, AppStatus } from '../types';
import { themeColors } from '../utils/theme';

interface LibraryItemProps {
  item: GalleryItem;
  isSelected: boolean;
  onSelect: () => void;
  theme: 'light' | 'dark';
}

export const LibraryItem: React.FC<LibraryItemProps> = ({ item, isSelected, onSelect, theme }) => {
  const c = themeColors[theme];

  return (
    <div className="flex gap-3 items-center group">
      {/* Thumbnail */}
      <div 
        onClick={onSelect}
        className={`
          w-12 h-12 rounded-lg overflow-hidden shrink-0 border cursor-pointer transition-all relative
          ${isSelected ? 'border-green-500 ring-2 ring-green-500/20' : `${c.border} hover:border-green-500`}
        `}
      >
        <img src={item.preview} className="w-full h-full object-cover" alt="thumb" />
        {item.status === AppStatus.SUCCESS && (
          <div className="absolute bottom-0 right-0 bg-green-500 text-white p-0.5 rounded-tl-md">
            <Check size={8} strokeWidth={4} />
          </div>
        )}
      </div>

      {/* Button / Label */}
      <button
        onClick={onSelect}
        className={`
          flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors truncate border
          ${isSelected 
            ? 'bg-[#238636] text-white border-transparent' 
            : `bg-transparent ${c.text} ${c.border} hover:border-green-500`}
        `}
      >
        {item.file.name}
      </button>
    </div>
  );
};