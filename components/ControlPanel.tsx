import React from 'react';
import { StyleSelector } from './StyleSelector';
import { Button } from './Button';
import { AspectRatio, AppStatus } from '../types';
import { Language, translations } from '../utils/translations';
import { Wand2 } from 'lucide-react';
import { themeColors } from '../utils/theme';

interface ControlPanelProps {
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

export const ControlPanel: React.FC<ControlPanelProps> = ({
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
      w-full rounded-xl border p-6 transition-colors duration-200
      ${c.bgPanel} ${c.border}
    `}>
      <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${c.text}`}>
        🎛️ Controles do Estúdio
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Configs */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <label className={`text-xs font-semibold mb-1.5 block ${c.textSecondary}`}>
              {t.style_label}
            </label>
            <div className={`h-[42px] px-3 flex items-center rounded-lg border ${c.inputBg} ${c.border}`}>
              <StyleSelector 
                selectedStyle={selectedStyle} 
                onSelect={onStyleSelect} 
                language={language} 
                compact={true}
              />
            </div>
          </div>
          
          <div>
            <label className={`text-xs font-semibold mb-1.5 block ${c.textSecondary}`}>
              {t.ratio_label}
            </label>
            <div className={`h-[42px] px-3 flex items-center rounded-lg border ${c.inputBg} ${c.border}`}>
              <select
                value={aspectRatio}
                onChange={(e) => onRatioChange(e.target.value as AspectRatio)}
                className={`w-full bg-transparent border-none outline-none text-sm font-medium cursor-pointer ${c.text}`}
              >
                 <option value="1:1" className={`${c.bgPanel}`}>1:1 (Quadrado)</option>
                 <option value="9:16" className={`${c.bgPanel}`}>9:16 (Stories)</option>
                 <option value="16:9" className={`${c.bgPanel}`}>16:9 (Youtube)</option>
                 <option value="3:4" className={`${c.bgPanel}`}>3:4 (Retrato)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Column 2: Prompt */}
        <div className="lg:col-span-6">
           <label className={`text-xs font-semibold mb-1.5 block ${c.textSecondary}`}>
            {t.prompt_label}
          </label>
          <textarea 
            value={customPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={t.prompt_placeholder}
            className={`
              w-full h-[108px] p-3 rounded-lg border outline-none transition-all resize-none text-sm
              ${c.inputBg} ${c.border} ${c.text}
              focus:ring-2 focus:ring-green-500/20 focus:border-green-500
            `}
          />
        </div>

        {/* Column 3: Action */}
        <div className="lg:col-span-3 flex items-end">
          <Button 
            onClick={onGenerate}
            isLoading={status === AppStatus.GENERATING}
            className={`w-full h-[50px] rounded-lg font-bold text-sm shadow-none border-none ${c.accent}`}
          >
             {status === AppStatus.GENERATING ? '' : <><Wand2 size={16} /> {t.btn_generate}</>}
          </Button>
        </div>

      </div>
    </div>
  );
};