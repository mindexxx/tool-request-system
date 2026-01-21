import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user?: { name: string; role: string } | null;
  onLogout?: () => void;
  title?: string;
  language: 'CN' | 'EN';
  onToggleLanguage: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, title, language, onToggleLanguage }) => {
  return (
    <div className="min-h-screen bg-pudding-bg text-pudding-black font-sans selection:bg-pudding-accent selection:text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b-2 border-pudding-black bg-pudding-bg/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-pudding-black text-white flex items-center justify-center font-serif font-bold text-xl">
              T
            </div>
            <h1 className="font-serif font-bold text-lg hidden sm:block">
              {title || (language === 'CN' ? '工具开发需求收集平台' : 'Tool Request Platform')}
            </h1>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
             <button 
              onClick={onToggleLanguage}
              className="font-mono text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-100 transition-colors w-12 text-center"
            >
              {language === 'CN' ? 'EN' : '中文'}
            </button>

            {user ? (
              <>
                <span className="hidden sm:inline text-gray-500">
                  {user.name} <span className="text-xs border border-gray-400 px-1 rounded ml-1">{user.role === 'admin' ? (language === 'CN' ? '管理员' : 'Admin') : (language === 'CN' ? '员工' : 'Staff')}</span>
                </span>
                <button 
                  onClick={onLogout}
                  className="hover:underline decoration-2 decoration-pudding-accent underline-offset-4"
                >
                  {language === 'CN' ? '登出' : 'Logout'}
                </button>
              </>
            ) : (
              <span className="text-gray-400">{language === 'CN' ? '请先登录' : 'Please Login'}</span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-10 text-center text-xs text-gray-500 font-sans">
        <p>© 2024 Internal Tools Team. Built for efficiency.</p>
      </footer>
    </div>
  );
};