
import React, { useRef } from 'react';
import FileTree from './FileTree';
import { FileSystemTree } from '../types';

interface FileExplorerProps {
  fileTree: FileSystemTree[] | null;
  onFolderSelected: (files: FileList) => void;
  onFileSelect: (handle: FileSystemFileHandle | File, path: string) => void;
  activeFilePath: string | null;
  isLoading: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ fileTree, onFolderSelected, onFileSelect, activeFilePath, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFolderSelected(files);
    }
    // Reset the input value to allow selecting the same folder again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-xl shadow-lg h-full flex flex-col text-slate-800">
      <h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-300">File Explorer</h2>
      <div className="mb-4">
        <input
          type="file"
          // @ts-ignore: These attributes are non-standard but necessary for directory selection
          webkitdirectory=""
          directory=""
          multiple
          ref={inputRef}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />
        <button
          onClick={handleLoadClick}
          className="w-full bg-white hover:bg-slate-100 text-slate-700 font-semibold py-2 px-4 border border-slate-300 rounded-lg shadow-sm transition-colors duration-150 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 015.25 7.5h13.5a2.25 2.25 0 012.25 2.25m-16.5 0v6.75a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-6.75m-16.5 0H3.75" />
          </svg>
          Load Folder
        </button>
      </div>
      <div className="flex-grow overflow-auto pr-2">
        {isLoading && <p className="text-slate-500 animate-pulse">Loading folder...</p>}
        {!isLoading && fileTree && fileTree.length > 0 && (
          <FileTree nodes={fileTree} onFileSelect={onFileSelect} activeFilePath={activeFilePath} />
        )}
        {!isLoading && fileTree && fileTree.length === 0 && (
          <p className="text-slate-500 text-sm p-2">The selected folder is empty.</p>
        )}
        {!isLoading && !fileTree && (
           <div className="text-center text-slate-500 mt-8 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto opacity-40">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <p className="mt-2 text-sm">Load a project folder to begin.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
