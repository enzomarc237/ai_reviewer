import { FileSystemTree } from '../types';
import { SUPPORTED_LANGUAGES, LANGUAGE_MAP } from '../constants';

export async function traverseDirectory(
  directoryHandle: FileSystemDirectoryHandle,
  path: string = ''
): Promise<FileSystemTree[]> {
  const entries: FileSystemTree[] = [];
  for await (const handle of directoryHandle.values()) {
    const newPath = path ? `${path}/${handle.name}` : handle.name;
    if (handle.kind === 'directory') {
      entries.push({
        name: handle.name,
        // Fix: Explicitly cast handle to FileSystemDirectoryHandle because TypeScript's
        // type narrowing is not working correctly in this context.
        handle: handle as FileSystemDirectoryHandle,
        kind: 'directory',
        path: newPath,
        // Fix: The handle must also be cast for the recursive call.
        children: await traverseDirectory(handle as FileSystemDirectoryHandle, newPath),
      });
    } else if (handle.kind === 'file') {
      entries.push({
        name: handle.name,
        // Fix: Explicitly cast handle to FileSystemFileHandle.
        handle: handle as FileSystemFileHandle,
        kind: 'file',
        path: newPath,
      });
    }
  }
  // Sort entries so directories come first, then files, both alphabetically
  return entries.sort((a, b) => {
    if (a.kind === 'directory' && b.kind === 'file') return -1;
    if (a.kind === 'file' && b.kind === 'directory') return 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Builds a FileSystemTree from a flat FileList, typically from an
 * <input type="file" webkitdirectory /> element.
 * It uses the non-standard `webkitRelativePath` property to reconstruct the directory structure.
 */
export function buildTreeFromFileList(files: FileList): FileSystemTree[] {
  const treeRoot: any = {};

  for (const file of Array.from(files)) {
    // The webkitRelativePath is non-standard but the key to this whole approach.
    const path = (file as any).webkitRelativePath;
    if (!path) continue;
    
    let current = treeRoot;
    const parts = path.split('/');
    
    parts.forEach((part, index) => {
        const isLast = index === parts.length - 1;
        if (!current[part]) {
            if (isLast) {
                current[part] = {
                    name: part,
                    kind: 'file',
                    path: path,
                    handle: file, // Store the File object as the handle
                };
            } else {
                current[part] = {
                    name: part,
                    kind: 'directory',
                    path: parts.slice(0, index + 1).join('/'),
                    children: {},
                };
            }
        }
        if (current[part].children) {
            current = current[part].children;
        }
    });
  }

  // Recursively convert the intermediate object structure to the final array-based tree
  const convertObjectToArray = (obj: any): FileSystemTree[] => {
      const arr = Object.values(obj).map((node: any) => {
          if (node.kind === 'directory' && node.children) {
              node.children = convertObjectToArray(node.children);
          }
          return node as FileSystemTree;
      });

      return arr.sort((a, b) => {
          if (a.kind === 'directory' && b.kind === 'file') return -1;
          if (a.kind === 'file' && b.kind === 'directory') return 1;
          return a.name.localeCompare(b.name);
      });
  };

  return convertObjectToArray(treeRoot);
}

export function detectLanguage(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension && LANGUAGE_MAP[extension]) {
    return LANGUAGE_MAP[extension];
  }
  // Fallback to a default if no match, or the first supported language
  return SUPPORTED_LANGUAGES[0].value;
}