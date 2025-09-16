import React from 'react';
import Spinner from './common/Spinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface FeedbackPanelProps {
  feedback: string | null;
  isLoading: boolean;
  error: string | null;
  fileName?: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, isLoading, error, fileName }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl h-full flex flex-col text-slate-100">
      <h2 className="text-2xl font-semibold text-slate-100 mb-4 truncate" title={fileName}>
        Review Feedback {fileName && `for ${fileName}`}
      </h2>
      <div className="bg-slate-900 p-4 rounded-lg flex-grow overflow-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Spinner color="text-blue-400" size="lg" />
            <p className="mt-4 text-lg">Analyzing your code with Gemini...</p>
            <p className="text-sm">This might take a few moments.</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xl font-semibold">An Error Occurred</p>
            <p className="mt-2 text-center text-red-300">{error}</p>
          </div>
        )}
        {!isLoading && !error && feedback && (
          <ReactMarkdown
              className="prose prose-sm prose-invert max-w-none"
              children={feedback}
              remarkPlugins={[remarkGfm]}
              components={{
                  code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                          <SyntaxHighlighter
                              style={okaidia}
                              language={match[1]}
                              PreTag="div"
                              children={String(children).replace(/\n$/, '')}
                              {...props}
                          />
                      ) : (
                          <code className={className} {...props}>
                              {children}
                          </code>
                      )
                  }
              }}
          />
        )}
        {!isLoading && !error && !feedback && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <p className="text-lg">Your code review will appear here.</p>
            <p className="text-sm">Enter some code and click "Review Code" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPanel;