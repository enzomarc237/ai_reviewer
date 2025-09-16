
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg p-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-blue-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h1 className="text-3xl font-bold tracking-tight">AI Code Reviewer</h1>
        </div>
        <p className="text-sm text-slate-300 hidden md:block">Powered by Gemini</p>
      </div>
    </header>
  );
};

export default Header;
