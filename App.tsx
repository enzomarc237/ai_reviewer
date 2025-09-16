import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import FeedbackPanel from './components/FeedbackPanel';
import FileExplorer from './components/FileExplorer';
import { reviewCode } from './services/geminiService';
import { SUPPORTED_LANGUAGES, EXAMPLE_CODE } from './constants';
import { FileSystemTree } from './types';
import { buildTreeFromFileList, detectLanguage } from './utils/fileUtils';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].value);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [fileTree, setFileTree] = useState<FileSystemTree[] | null>(null);
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);
  const [isLoadingFolder, setIsLoadingFolder] = useState<boolean>(false);
  const [reviewedFilePath, setReviewedFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (!fileTree && !code.trim() && EXAMPLE_CODE[language]) {
      setCode(EXAMPLE_CODE[language]);
    }
  }, [language, fileTree, code]);

  const handleFolderSelected = useCallback(async (files: FileList) => {
    setIsLoadingFolder(true);
    try {
      const tree = buildTreeFromFileList(files);
      setFileTree(tree);
      setCode(''); // Clear editor
      setActiveFilePath(null);
      setFeedback(null);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error processing folder: ${err.message}`);
        console.error("Folder processing failed:", err);
      }
    } finally {
        setIsLoadingFolder(false);
    }
  }, []);

  const handleFileSelect = useCallback(async (fileHandleOrFile: FileSystemFileHandle | File, path: string) => {
      if (isLoading) return; // Don't allow file switching during review
      try {
          let file: File;
          // Check if we have a File object directly (from the new method) or a handle (from the old API)
          if (fileHandleOrFile instanceof File) {
            file = fileHandleOrFile;
          } else {
            file = await fileHandleOrFile.getFile();
          }

          const content = await file.text();
          const lang = detectLanguage(file.name);
          
          setCode(content);
          setLanguage(lang);
          setActiveFilePath(path);
          setFeedback(null); // Clear feedback when new file is opened
          setError(null);
      } catch (err) {
          if (err instanceof Error) {
            setError(`Error reading file: ${err.message}`);
            console.error("File read failed:", err);
          }
      }
  }, [isLoading]);


  const handleReviewCode = useCallback(async () => {
    if (!code.trim()) {
      setError('Please select a file or enter some code to review.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null); 

    try {
      const geminiFeedback = await reviewCode(code, language);
      setFeedback(geminiFeedback);
      setReviewedFilePath(activeFilePath); // Mark which file this review is for
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
      setReviewedFilePath(null);
      console.error("Review failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [code, language, activeFilePath]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-200">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,0.75fr)_1.5fr_1fr] gap-6 h-full min-h-[calc(100vh-160px)]">
          <div className="lg:h-full">
            <FileExplorer 
              fileTree={fileTree} 
              onFolderSelected={handleFolderSelected}
              onFileSelect={handleFileSelect}
              activeFilePath={activeFilePath}
              isLoading={isLoadingFolder}
            />
          </div>
          <div className="lg:h-full">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onReview={handleReviewCode}
              isLoading={isLoading}
              fileName={activeFilePath?.split('/').pop()}
            />
          </div>
          <div className="lg:h-full">
            <FeedbackPanel
              feedback={feedback}
              isLoading={isLoading}
              error={error}
              fileName={reviewedFilePath?.split('/').pop()}
            />
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-slate-600 bg-slate-300">
        AI Code Reviewer &copy; {new Date().getFullYear()}. For educational purposes.
      </footer>
    </div>
  );
};

export default App;
