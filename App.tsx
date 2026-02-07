import React, { useState, useEffect, useRef } from 'react';
import { generateStyledImage } from './services/geminiService';
import { AppStatus, GalleryItem, AspectRatio } from './types';
import { translations, Language, Theme } from './utils/translations';
import { themeColors } from './utils/theme';
import { STYLES, StyleSelector } from './components/StyleSelector';
import { ImageUpload } from './components/ImageUpload';
import { Button } from './components/Button';
import { Download, Camera, Sparkles, Wand2, X } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  // --- STATE ---
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Token System
  const [tokenBalance, setTokenBalance] = useState(20);

  // App State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  
  // Controls
  const [selectedStyle, setSelectedStyle] = useState<string>(STYLES[0].id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // Config
  const [language, setLanguage] = useState<Language>('pt');
  const [theme, setTheme] = useState<Theme>('light');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DERIVED ---
  const t = translations[language];
  const c = themeColors[theme];
  const currentItem = galleryItems[selectedIndex] || null;
  const status = currentItem?.status || AppStatus.IDLE;

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "admin" && loginPass === "123") {
      setIsLoggedIn(true);
      setUserName("Admin");
      setLoginError(false);
      setTokenBalance(20); // Reset balance on login
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginEmail("");
    setLoginPass("");
    setGalleryItems([]);
  };

  const handleFiles = async (files: File[]) => {
    const newItems: GalleryItem[] = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        
        newItems.push({
          id: Math.random().toString(36).substring(7),
          file,
          preview: base64,
          generated: null,
          status: AppStatus.IDLE
        });
      }
    }

    setGalleryItems(prev => {
      const updated = [...prev, ...newItems];
      if (prev.length === 0 && newItems.length > 0) setSelectedIndex(0);
      else if (prev.length > 0) setSelectedIndex(prev.length);
      return updated;
    });
  };

  const handleDeleteItem = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); // Prevent selection when clicking delete
    setGalleryItems(prev => {
      const newItems = prev.filter((_, i) => i !== index);
      // Adjust selected index if needed
      if (selectedIndex >= newItems.length) {
        setSelectedIndex(Math.max(0, newItems.length - 1));
      }
      return newItems;
    });
  };

  const handleGenerate = async () => {
    if (!currentItem) return;

    if (tokenBalance < 1) {
       setGalleryItems(prev => prev.map((item, idx) => 
        idx === selectedIndex ? { ...item, status: AppStatus.ERROR, error: t.no_tokens_error } : item
      ));
      return;
    }

    const updateStatus = (s: AppStatus, err?: string) => {
      setGalleryItems(prev => prev.map((item, idx) => 
        idx === selectedIndex ? { ...item, status: s, error: err } : item
      ));
    };

    // Deduct token
    setTokenBalance(prev => prev - 1);
    updateStatus(AppStatus.GENERATING);

    try {
      const base64Data = currentItem.preview.split(',')[1];
      const mimeType = currentItem.preview.substring(currentItem.preview.indexOf(':') + 1, currentItem.preview.indexOf(';'));
      const styleConfig = STYLES.find(s => s.id === selectedStyle);
      const stylePrompt = styleConfig ? styleConfig.prompt : STYLES[0].prompt;

      const result = await generateStyledImage(
        base64Data,
        mimeType,
        stylePrompt,
        customPrompt,
        aspectRatio
      );

      setGalleryItems(prev => prev.map((item, idx) => 
        idx === selectedIndex ? { ...item, status: AppStatus.SUCCESS, generated: result } : item
      ));

    } catch (e: any) {
      console.error(e);
      // Refund token on error
      setTokenBalance(prev => prev + 1);
      updateStatus(AppStatus.ERROR, e.message);
    }
  };

  const handleDownloadCurrent = () => {
    if (!currentItem?.generated) return;
    const link = document.createElement('a');
    link.href = `data:${currentItem.generated.mimeType};base64,${currentItem.generated.data}`;
    link.download = `AI_Studio_${currentItem.file.name.split('.')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // --- RENDER: LOGIN PAGE ---
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${c.bgApp}`}>
        <div className={`w-full max-w-[400px] p-10 rounded-3xl shadow-2xl border text-center ${c.bgPanel} ${c.border} ${c.text}`}>
           <div className="text-5xl mb-6">🌿</div>
           <h1 className="text-2xl font-bold mb-2">{t.login_welcome}</h1>
           <p className={`text-sm mb-8 ${c.textSecondary}`}>{t.login_sub}</p>
           
           <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="Email" 
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${c.inputBg} ${c.border} ${c.text} focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
              />
              <input 
                type="password" 
                placeholder="Senha" 
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                className={`w-full h-12 px-4 rounded-xl border outline-none transition-all ${c.inputBg} ${c.border} ${c.text} focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
              />
              
              {loginError && <p className="text-red-500 text-sm">{t.login_error}</p>}
              
              <Button type="submit" className="w-full h-12 mt-4">{t.login_btn}</Button>
           </form>
           
           {/* Theme Toggle for Login Screen */}
           <div className="mt-8 flex justify-center">
              <button 
                  onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                  className={`p-2 rounded-full border ${c.border} hover:border-[#4CAF50] transition-colors`}
              >
                  {theme === 'dark' ? '☀️' : '🌙'}
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN APP ---
  return (
    <div className={`flex flex-col md:flex-row h-screen w-full overflow-hidden transition-colors duration-200 font-sans ${c.bgApp} ${c.text}`}>
      
      {/* Hidden Global Input for "Change Photo" */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
      />

      {/* --- SIDEBAR --- */}
      <aside className={`w-full md:w-80 flex-shrink-0 flex flex-col border-r ${c.bgPanel} ${c.border} z-20`}>
        
        {/* Header */}
        <div className="p-5 pb-2">
          <div className="flex items-center gap-3">
             <span className="text-xl">🌿</span>
             <div>
               <h1 className="font-bold text-lg leading-tight">{t.title}</h1>
               <p className={`text-xs ${c.textSecondary}`}>
                 {t.welcome_user.replace('{name}', userName)}
               </p>
             </div>
          </div>
          
          <div className="mt-3">
             <button 
               onClick={handleLogout}
               className={`text-xs px-3 py-1.5 rounded border transition-colors ${c.border} ${c.textSecondary} hover:text-red-500 hover:border-red-500`}
             >
               {t.logout}
             </button>
          </div>

          <div className={`h-[1px] w-full mt-4 ${c.border} border-t`} />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">
           
           {/* Upload & Gallery */}
           <div>
             <label className={`text-xs font-bold uppercase mb-2 block ${c.textSecondary}`}>{t.upload_label}</label>
             <ImageUpload onImagesSelected={handleFiles} language={language} compact={true} />
             
             {galleryItems.length > 0 && (
                <div className="mt-4">
                  <p className={`text-xs ${c.textSecondary} mb-2`}>{t.gallery_title} ({galleryItems.length})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {galleryItems.map((item, idx) => (
                      <div key={item.id} className="relative group">
                        <button
                          onClick={() => setSelectedIndex(idx)}
                          className={`
                            w-full aspect-square rounded-sm overflow-hidden border-2 relative transition-all
                            ${selectedIndex === idx 
                              ? 'border-[#4CAF50]' 
                              : 'border-transparent bg-[#EEE] dark:bg-[#333] hover:border-slate-300'}
                          `}
                        >
                          <img src={item.preview} className="w-full h-full object-cover" alt={`img-${idx}`} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteItem(e, idx)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white dark:bg-[#252525] border border-red-500 text-red-500 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             )}
           </div>

           <div className={`h-[1px] w-full ${c.border} border-t`} />

           {/* Style Selector */}
           <div>
              <label className={`text-xs font-bold uppercase mb-2 block ${c.textSecondary}`}>{t.style_label}</label>
              <StyleSelector 
                selectedStyle={selectedStyle}
                onSelect={setSelectedStyle}
                language={language}
              />
           </div>

           {/* Ratio Selector */}
           <div>
              <label className={`text-xs font-bold uppercase mb-2 block ${c.textSecondary}`}>{t.ratio_label}</label>
              <div className="relative">
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                  className="w-full h-[42px] px-3 rounded-lg border bg-transparent outline-none text-sm font-medium cursor-pointer appearance-none border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-200 focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                >
                  <option value="1:1" className="bg-white dark:bg-[#161B22]">{t.ratios["1:1"]}</option>
                  <option value="3:4" className="bg-white dark:bg-[#161B22]">{t.ratios["3:4"]}</option>
                  <option value="9:16" className="bg-white dark:bg-[#161B22]">{t.ratios["9:16"]}</option>
                  <option value="16:9" className="bg-white dark:bg-[#161B22]">{t.ratios["16:9"]}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
           </div>

           {/* Prompt & Button */}
           <div>
              <label className={`text-xs font-bold uppercase mb-2 block ${c.textSecondary}`}>{t.prompt_label}</label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={t.prompt_placeholder}
                className={`
                  w-full h-24 p-3 rounded-lg border text-sm resize-none outline-none transition-all
                  ${c.inputBg} ${c.border} focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]
                `}
              />
              <div className="mt-4">
                 <Button 
                    onClick={handleGenerate}
                    isLoading={status === AppStatus.GENERATING}
                    disabled={!currentItem}
                    className="w-full h-[52px]"
                 >
                   {status === AppStatus.GENERATING ? '' : t.btn_generate}
                 </Button>
              </div>
           </div>

        </div>

        {/* Footer (Lang | Theme) */}
        <div className={`p-4 border-t ${c.bgPanel} ${c.border}`}>
            <div className="grid grid-cols-[2fr_0.8fr_0.8fr] gap-2 items-center">
                <span className={`text-xs ${c.textSecondary}`}>Powered by Gemini</span>
                <button 
                    onClick={() => setLanguage(l => l === 'pt' ? 'en' : 'pt')}
                    className={`flex items-center justify-center px-2 py-1 text-xs border rounded transition-colors uppercase ${c.border} ${c.text} hover:text-[#4CAF50] hover:border-[#4CAF50]`}
                >
                    {language}
                </button>
                <button 
                    onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                    className={`flex items-center justify-center px-2 py-1 text-xs border rounded transition-colors ${c.border} ${c.text} hover:text-[#4CAF50] hover:border-[#4CAF50]`}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </div>

      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col min-w-0">
        
        {/* Token Balance Header (Metric Style) */}
        <div className="flex justify-end mb-4">
          <div className={`flex flex-col items-end px-2`}>
            <span className={`text-[11px] uppercase font-bold tracking-wider mb-0.5 ${c.textSecondary}`}>{t.balance}</span>
            <div className={`text-2xl font-bold ${c.text} flex items-center gap-2 leading-none`}>
              {tokenBalance} <span className="text-xl">🪙</span>
            </div>
          </div>
        </div>

        {!currentItem ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className={`p-10 rounded-2xl border ${c.bgPanel} ${c.border}`}>
                 <h1 className={`text-2xl font-bold mb-2 ${c.accentText}`}>{t.title}</h1>
                 <p className={`${c.textSecondary}`}>{t.empty_state_desc}</p>
              </div>
           </div>
        ) : (
           <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6 h-full md:h-auto">
             
             {/* CARD 1: ORIGINAL (Adaptive Theme) */}
             <div className={`flex flex-col rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border h-[650px] ${c.bgPanel} ${c.border} ${c.text}`}>
                <div className="font-bold text-lg mb-5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[#4CAF50]">
                     <Camera size={18} />
                     {t.orig_title}
                   </div>
                   <button 
                      onClick={triggerFileUpload}
                      className="text-[#E53935] text-sm hover:underline cursor-pointer border-none bg-transparent"
                    >
                      {t.change_photo}
                    </button>
                </div>
                {/* Image Content Area (Dynamic BG) */}
                <div className={`flex-1 rounded-xl border flex items-center justify-center overflow-hidden relative ${c.border} ${c.bgApp}`}>
                   <img src={currentItem.preview} alt="Original" className="max-w-full max-h-full object-contain" />
                </div>
             </div>

             {/* CARD 2: RESULT (Adaptive Theme) */}
             <div className={`flex flex-col rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border h-[650px] ${c.bgPanel} ${c.border} ${c.text}`}>
                <div className="font-bold text-lg mb-5 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[#4CAF50]">
                      <Wand2 size={18} />
                      {t.res_title}
                   </div>
                   <button 
                     onClick={handleDownloadCurrent} 
                     disabled={!currentItem.generated}
                     className={`
                       flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm transition-colors
                       ${currentItem.generated 
                          ? 'border-[#E0E0E0] hover:border-[#4CAF50] hover:text-[#4CAF50] cursor-pointer' 
                          : 'border-[#E0E0E0] opacity-50 cursor-not-allowed'}
                       ${c.text}
                     `} 
                   >
                      <Download size={14} />
                      {t.download}
                   </button>
                </div>
                {/* Image Content Area (Dynamic BG) */}
                <div className={`flex-1 rounded-xl border flex items-center justify-center overflow-hidden relative ${c.border} ${c.bgApp}`}>
                   {currentItem.generated ? (
                      <img 
                        src={`data:${currentItem.generated.mimeType};base64,${currentItem.generated.data}`} 
                        alt="Result" 
                        className="max-w-full max-h-full object-contain animate-in fade-in zoom-in duration-500" 
                      />
                   ) : (
                      <div className="text-center flex flex-col items-center justify-center p-8 opacity-40">
                         {status === AppStatus.GENERATING ? (
                            <>
                              <div className="w-12 h-12 border-4 border-[#4CAF50] border-t-transparent rounded-full animate-spin mb-4"></div>
                              <p className="text-[#4CAF50] font-medium animate-pulse">{t.processing}</p>
                            </>
                         ) : (
                            <>
                              <Sparkles size={48} className={`mb-2 ${c.text}`} />
                              <p className={`${c.text}`}>{
                                status === AppStatus.ERROR ? (currentItem.error || "Erro") : t.waiting
                              }</p>
                            </>
                         )}
                      </div>
                   )}
                </div>
             </div>

           </div>
        )}

      </main>
      <SpeedInsights />
    </div>
  );
};

export default App;
