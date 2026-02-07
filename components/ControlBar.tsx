import React from 'react';
import { StyleSelector } from './StyleSelector';
import { Button } from './Button';
import { AspectRatio, AppStatus } from '../types';
import { Language, translations } from '../utils/translations';
import { Wand2 } from 'lucide-react';
import { themeColors } from '../utils/theme';

interface ControlBarProps {
  selectedStyle: string;
  onStyleSelect: (id: string) => void;
  customPrompt: string;
  onPromptChange: (val: string) => void;
  aspectRatio: AspectRatio;
  onRatioChange: (val: AspectRatio) => void;
  onGenerate: () => void;
  status: AppStatus;
  language: Language;
  theme: 'light' | 'dark';
}

export const ControlBar: React.FC<ControlBarProps> = ({
  selectedStyle,
  onStyleSelect,
  customPrompt,
  onPromptChange,
  aspectRatio,
  onRatioChange,
  onGenerate,
  status,
  language,
  theme
}) => {
  const t = translations[language];
  const c = themeColors[theme];

  return (
    <div className={`
      max-w-5xl mx-auto rounded-2xl p-4 shadow-2xl border transition-colors duration-300
      ${c.bgBar} ${c.border} ${c.text}
    `}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* Style Selector */}
        <div className="md:col-span-3">
          <label className={`text-xs font-bold uppercase mb-1.5 block tracking-wider ${c.textSecondary}`}>
            {t.style_label}
          </label>
          <div className={`h-[50px] px-3 flex items-center rounded-xl border ${c.inputBg} ${c.border}`}>
            <StyleSelector 
              selectedStyle={selectedStyle} 
              onSelect={onStyleSelect} 
              language={language} 
              compact={true}
            />
          </div>
        </div>

        {/* Prompt Input */}
        <div className="md:col-span-5">
           <label className={`text-xs font-bold uppercase mb-1.5 block tracking-wider ${c.textSecondary}`}>
            {t.prompt_label}
          </label>
          <input 
            type="text" 
            value={customPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={t.prompt_placeholder}
            className={`
              w-full h-[50px] px-4 rounded-xl border outline-none transition-all
              ${c.inputBg} ${c.border} ${c.text}
              focus:ring-2 focus:ring-green-500/20 focus:border-green-500
            `}
          />
        </div>

        {/* Aspect Ratio */}
        <div className="md:col-span-2">
           <label className={`text-xs font-bold uppercase mb-1.5 block tracking-wider ${c.textSecondary}`}>
            {t.ratio_label}
          </label>
          <div className={`h-[50px] px-3 flex items-center rounded-xl border ${c.inputBg} ${c.border}`}>
            <select
              value={aspectRatio}
              onChange={(e) => onRatioChange(e.target.value as AspectRatio)}
              className="w-full bg-transparent border-none outline-none text-inherit font-medium cursor-pointer"
            >
               <option value="1:1" className="bg-white dark:bg-[#21262D]">1:1</option>
               <option value="9:16" className="bg-white dark:bg-[#21262D]">9:16</option>
               <option value="16:9" className="bg-white dark:bg-[#21262D]">16:9</option>
               <option value="3:4" className="bg-white dark:bg-[#21262D]">3:4</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="md:col-span-2">
          <Button 
            onClick={onGenerate}
            isLoading={status === AppStatus.GENERATING}
            className="w-full h-[50px] rounded-xl font-bold bg-[#238636] hover:bg-[#2EA043] shadow-none border-none text-white"
          >
             {status === AppStatus.GENERATING ? '' : <><Wand2 size={18} /> {t.btn_generate.split(' ')[0]}</>}
          </Button>
        </div>

      </div>
    </div>
  );
};