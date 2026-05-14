'use client';
import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; message: string; tone: 'default' | 'danger' | 'success' };
type Ctx = { push: (msg: string, tone?: Toast['tone']) => void };

const ToastCtx = createContext<Ctx | null>(null);

export function useToast(): Ctx {
  const v = useContext(ToastCtx);
  if (!v) throw new Error('ToastProvider missing');
  return v;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, message, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toast-region">
        {items.map((t) => (
          <div key={t.id} className={'toast ' + (t.tone === 'danger' ? 'danger' : t.tone === 'success' ? 'success' : '')}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
