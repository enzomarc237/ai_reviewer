import React, { useState } from 'react';
import { FileSystemTree } from '../types';

interface FileTreeProps {
  nodes: FileSystemTree[];
  onFileSelect: (handle: FileSystemFileHandle | File, path: string) => void;
  activeFilePath: string | null;
  level?: number;
}

const FileOrFolderIcon: React.FC<{ node: FileSystemTree, isOpen?: boolean }> = ({ node, isOpen }) => {
  if (node.kind === 'directory') {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 text-amber-500">
            {isOpen ? 
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 015.25 7.5h13.5a2.25 2.25 0 012.25 2.25m-16.5 0v6.75a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-6.75m-16.5 0H3.75" /> :
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            }
        </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 flex-shrink-0 text-slate-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
};


const TreeNode: React.FC<{ node: FileSystemTree } & Omit<FileTreeProps, 'nodes'>> = ({ node, onFileSelect, activeFilePath, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    if (node.kind === 'directory') {
      setIsOpen(!isOpen);
    } else if (node.handle) {
      // Fix: Explicitly cast node.handle as the FileSystemTree type is not a
      // discriminated union, preventing TypeScript from inferring the correct handle type
      // based on node.kind. The logic ensures onFileSelect is only called for files.
      onFileSelect(node.handle as FileSystemFileHandle | File, node.path);
    }
  };

  const isSelected = node.kind === 'file' && activeFilePath === node.path;
  const baseClasses = "flex items-center p-1.5 rounded-md cursor-pointer transition-colors duration-150 w-full text-left";
  const selectedClasses = "bg-blue-100 text-blue-800 font-semibold";
  const hoverClasses = "hover:bg-slate-200";

  return (
    <div style={{ paddingLeft: `${level * 16}px` }}>
      <button onClick={handleToggle} className={`${baseClasses} ${isSelected ? selectedClasses : hoverClasses}`}>
        <FileOrFolderIcon node={node} isOpen={isOpen} />
        <span className="truncate text-sm">{node.name}</span>
      </button>
      {node.kind === 'directory' && isOpen && node.children && (
        <FileTree nodes={node.children} onFileSelect={onFileSelect} activeFilePath={activeFilePath} level={level + 1} />
      )}
    </div>
  );
};


const FileTree: React.FC<FileTreeProps> = ({ nodes, onFileSelect, activeFilePath, level = 0 }) => {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) => (
        <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} activeFilePath={activeFilePath} level={level} />
      ))}
    </div>
  );
};

export default FileTree;