import DirectoryNode from "./directoryNode";
import type { FileEntry, Entry } from "./directoryNode";

class DirectoryNodeList {
  private root: DirectoryNode;
  private fileCount: number;

  constructor(rootId: string) {
    this.root = new DirectoryNode({ name: "root", id: rootId } as Entry, null);
    this.fileCount = 0;
  }

  async addNode(entry: FileEntry): Promise<DirectoryNode> {
    const node = await DirectoryNode.create(entry, this.root);
    this.root.addChild(node);
    return node;
  }

  async processNode(entry: FileEntry): Promise<void> {
    const node = await this.addNode(entry);
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
    return new Promise((resolve, reject) => {
      const dirReader = entry.createReader();
      const readEntries = () => {
        dirReader.readEntries((entries: FileEntry[]) => {
          if (entries.length === 0) {
            // No more entries, resolve the promise
            resolve();
          } else {
            // Process the current batch of entries
            const promises = entries.map(async (entry) => {
              const node = await DirectoryNode.create(entry, parentNode);
              parentNode.addChild(node);
              if (entry.isDirectory) {
                return this.parseDirectory(entry as FileSystemDirectoryEntry, node);
              } else {
                this.fileCount++;
                return Promise.resolve();
              }
            });
  
            // Wait for all current entries to be processed, then read more
            Promise.all(promises)
              .then(() => readEntries())
              .catch(reject);
          }
        }, reject);
      };
  
      // Start reading entries
      readEntries();
    });
  }
  
  getFiles(): DirectoryNode[] {
    return this.root.getFiles();
  }
}

export default DirectoryNodeList;
