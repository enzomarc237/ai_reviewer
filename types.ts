
export interface LanguageOption {
  value: string;
  label: string;
}

export interface FileSystemTree {
  name: string;
  // Handle can be a File object for files loaded via input,
  // or a FileSystemHandle for the original API.
  // It is optional for directories created from a FileList.
  handle?: FileSystemDirectoryHandle | FileSystemFileHandle | File;
  kind: 'file' | 'directory';
  path: string;
  children?: FileSystemTree[];
}
