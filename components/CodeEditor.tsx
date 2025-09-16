
import React from 'react';
import { LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES, EXAMPLE_CODE } from '../constants';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onReview: () => void;
  isLoading: boolean;
  fileName?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, setLanguage, onReview, isLoading, fileName }) => {
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (EXAMPLE_CODE[newLang] && !code.trim()) { // Only set example if code area is empty
      setCode(EXAMPLE_CODE[newLang]);
    }
  };
  
  const handleLoadExample = () => {
    if (EXAMPLE_CODE[language]) {
      setCode(EXAMPLE_CODE[language]);
    } else if (EXAMPLE_CODE['javascript']){ // fallback
       setCode(EXAMPLE_CODE['javascript']);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 truncate" title={fileName}>
          {fileName || 'Enter Your Code'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadExample}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors"
            title="Load an example snippet for the selected language"
          >
            Load Example
          </button>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-700 text-sm"
            aria-label="Select programming language"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Paste your ${SUPPORTED_LANGUAGES.find(l=>l.value === language)?.label || 'code'} here or load a folder...`}
        className="w-full flex-grow p-4 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm bg-slate-50 text-slate-800 h-96"
        spellCheck="false"
        aria-label="Code input area"
      />
      
      <div className="mt-auto pt-4"> {/* Pushes button to the bottom if CodeEditor is flex-col */}
        <button
            onClick={onReview}
            disabled={isLoading || !code.trim()}
            className={`w-full px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center justify-center
                        ${isLoading || !code.trim() ? 'bg-slate-400 text-slate-100 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500'}
                      `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reviewing...
              </>
            ) : "✨ Review Code ✨"}
          </button>
      </div>
    </div>
  );
};

export default CodeEditor;
