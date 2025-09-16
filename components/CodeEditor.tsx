import React from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-rust';

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

  const prismLanguage = language === 'cplusplus' ? 'cpp' : language;
  const placeholder = `Paste your ${SUPPORTED_LANGUAGES.find(l=>l.value === language)?.label || 'code'} here or load a folder...`;

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
      
      <div className="w-full flex-grow relative overflow-hidden rounded-lg border border-slate-300">
        <Editor
            value={code}
            onValueChange={setCode}
            highlight={code => Prism.highlight(code, Prism.languages[prismLanguage] || Prism.languages.javascript, prismLanguage)}
            padding={16}
            className="absolute top-0 left-0 right-0 bottom-0 overflow-auto"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: '#272822', // okaidia theme background
              color: '#f8f8f2',
            }}
            textareaId="code-editor"
            spellCheck="false"
            aria-label="Code input area"
        />
        {!code && (
            <div 
                className="absolute top-4 left-4 text-gray-500 pointer-events-none font-mono text-sm"
                aria-hidden="true"
            >
                {placeholder}
            </div>
        )}
    </div>
      
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