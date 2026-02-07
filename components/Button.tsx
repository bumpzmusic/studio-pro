import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `
      bg-[linear-gradient(180deg,#66BB6A_0%,#43A047_100%)]
      text-white
      border-[1px] border-[#388E3C]
      shadow-[0_2px_5px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]
      hover:bg-[linear-gradient(180deg,#81C784_0%,#4CAF50_100%)]
      hover:shadow-[0_4px_12px_rgba(76,175,80,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]
      hover:-translate-y-[1px]
      active:bg-[#388E3C]
      active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
      active:translate-y-[1px]
      active:border-[#2E7D32]
    `,
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200",
    outline: "border-2 border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : children}
    </button>
  );
};