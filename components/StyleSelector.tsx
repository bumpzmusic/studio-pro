import React from 'react';
import { StyleOption } from '../types';
import { Language } from '../utils/translations';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
  language: Language;
  compact?: boolean;
}

export const STYLES: StyleOption[] = [
  {
    id: 'studio-clean',
    name: 'Estúdio Minimalista',
    prompt: 'Professional product photography, clean white studio background, soft box lighting, minimal aesthetic, high detailed, sharp focus, 8k resolution.',
    description: 'Limpo e nítido',
    color: 'bg-gray-50'
  },
  {
    id: 'nature-sunlight',
    name: 'Luz Natural',
    prompt: 'Product placed in a natural setting, dappled sunlight filtering through leaves, organic textures, stone or wood surface, fresh and eco-friendly vibe.',
    description: 'Suave e acolhedor',
    color: 'bg-green-50'
  },
  {
    id: 'luxury-gold',
    name: 'Luxo / Mármore',
    prompt: 'High-end luxury product photography, black and gold color palette, dramatic lighting, golden reflections, premium texture, sophisticated atmosphere.',
    description: 'Sofisticado e premium',
    color: 'bg-yellow-900 text-white'
  },
  {
    id: 'nature-organic',
    name: 'Natureza Orgânica',
    prompt: 'Product surrounded by nature elements, soft green tones, organic shapes, fresh and eco-friendly atmosphere, bokeh background.',
    description: 'Fresco e natural',
    color: 'bg-green-100'
  },
  {
    id: 'industrial-concrete',
    name: 'Industrial / Concreto',
    prompt: 'Professional product photography, industrial style, raw concrete background, dramatic hard lighting, shadows, modern and edgy aesthetic.',
    description: 'Moderno e urbano',
    color: 'bg-gray-200'
  },
  {
    id: 'neon-cyberpunk',
    name: 'Neon / Futurista',
    prompt: 'Product photography with neon lighting, cyberpunk aesthetic, blue and pink rim lights, dark background, futuristic vibes, high contrast.',
    description: 'Vibrante e futuro',
    color: 'bg-purple-900 text-white'
  }
];

const TRANSLATED_LABELS: Record<string, { pt: string, en: string }> = {
  'studio-clean': { pt: 'Estúdio Minimalista', en: 'Minimalist Studio' },
  'nature-sunlight': { pt: 'Luz Natural', en: 'Natural Light' },
  'luxury-gold': { pt: 'Luxo / Mármore', en: 'Luxury / Marble' },
  'nature-organic': { pt: 'Natureza Orgânica', en: 'Organic Nature' },
  'industrial-concrete': { pt: 'Industrial / Concreto', en: 'Industrial / Concrete' },
  'neon-cyberpunk': { pt: 'Neon / Futurista', en: 'Neon / Cyberpunk' },
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect, language }) => {
  return (
    <div className="relative">
      <select 
        value={selectedStyle}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full h-[42px] px-3 rounded-lg border bg-transparent outline-none text-sm font-medium cursor-pointer appearance-none border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-200 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors"
      >
        {STYLES.map((style) => (
          <option key={style.id} value={style.id} className="bg-white dark:bg-[#161B22]">
            {language === 'pt' ? TRANSLATED_LABELS[style.id].pt : TRANSLATED_LABELS[style.id].en}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  );
};