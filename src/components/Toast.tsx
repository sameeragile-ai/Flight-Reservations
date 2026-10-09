import React from 'react';
import { useTravel } from '../context/TravelContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useTravel();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all ${
          toast.type === 'success'
            ? 'bg-slate-900 text-white border-slate-700 shadow-emerald-500/10'
            : toast.type === 'error'
            ? 'bg-rose-950 text-white border-rose-800 shadow-rose-500/10'
            : 'bg-slate-900 text-white border-slate-800 shadow-sky-500/10'
        }`}
      >
        {toast.type === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        {toast.type === 'error' && (
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
        )}
        {toast.type === 'info' && (
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
