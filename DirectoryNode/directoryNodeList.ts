import DirectoryNode from "./directoryNode";
import type { FileEntry, Entry } from "./directoryNode";

interface DirectoryNodeList {
  addNode(entry: FileEntry): DirectoryNode;
  processNode(entry: FileEntry): Promise<void>;
  getFiles(): DirectoryNode[];
}

class DirectoryNodeList {
  private root: DirectoryNode;
  private fileCount: number;

  constructor(rootId: string) {
    this.root = new DirectoryNode({ name: "root", id: rootId } as Entry, null);
    this.fileCount = 0;
  }
  addNode(entry: FileSystemEntry): DirectoryNode {
    const node = new DirectoryNode(entry as Entry, this.root);
    this.root.addChild(node);
    return node;
  }

  processNode(entry: FileSystemEntry): Promise<void> {
    let node = this.addNode(entry);
    if (entry.isDirectory) {
      return this.parseDirectory(entry as FileSystemDirectoryEntry, node);
    } else {
      this.fileCount++;
      return Promise.resolve();
    }
  }

  private parseDirectory(
    entry: FileSystemDirectoryEntry,
    parentNode: DirectoryNode
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dirReader = entry.createReader();
      dirReader.readEntries((entries: FileSystemEntry[]) => {
        const promises = entries.map((entry: FileSystemEntry) => {
          const node = new DirectoryNode(entry as Entry, parentNode);
          parentNode.addChild(node);
          if (entry.isDirectory) {
            return this.parseDirectory(entry as FileSystemDirectoryEntry, node);
          } else {
            this.fileCount++;
            return Promise.resolve();
          }
        });
        Promise.all(promises)
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  getFiles(): DirectoryNode[] {
    return this.root.getFiles();
  }
}

export default DirectoryNodeList;
