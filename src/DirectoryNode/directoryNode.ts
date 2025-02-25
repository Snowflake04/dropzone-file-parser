export type FileEntry = FileSystemDirectoryEntry | FileSystemEntry;

export type Entry = FileEntry & {
  id?: string;
};

class DirectoryNode {
  name: string;
  isFile: boolean;
  id: string;
  parent: DirectoryNode | null | undefined;
  size: number;
  children?: DirectoryNode[];
  fileCount: number;
  file?: File;
  sizeUpdatePromise: Promise<void>;

  constructor(entry: Entry, parent?: DirectoryNode | null) {
    this.name = entry.name || "root";
    this.isFile = entry.isFile || false;
    this.id = entry.id || "";
    this.parent = parent;
    this.size = 0;
    this.fileCount = 0;
    this.sizeUpdatePromise = this.initialize(entry);
  }

  private async initialize(entry: Entry): Promise<void> {
    if (entry.isFile) {
      return new Promise((resolve, reject) => {
        (entry as FileSystemFileEntry).file((f: File) => {
          this.file = f;
          this.size = f.size;
          if (this.parent) {
            this.parent.updateSize(f.size);
          }
          resolve();
        }, reject);
      });
    } else {
      this.children = [];
      this.fileCount = 0;
      return Promise.resolve();
    }
  }

  static async create(
    entry: Entry,
    parent?: DirectoryNode | null
  ): Promise<DirectoryNode> {
    const node = new DirectoryNode(entry, parent);
    await node.sizeUpdatePromise;
    return node;
  }

  addChild(node: DirectoryNode): void {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(node);
    if (node.isFile) {
      this.updateFileCount();
    }
  }

  updateSize(size: number): void {
    this.size = this.size + size;
    if (this.parent) {
      this.parent.updateSize(size);
    }
  }

  updateFileCount(): void {
    this.fileCount++;
    if (this.parent) {
      this.parent.updateFileCount();
    }
  }

  getFiles(): DirectoryNode[] {
    if (this.isFile) {
      return [this];
    } else {
      return (
        this.children?.reduce<DirectoryNode[]>(
          (files, child) => files.concat(child.getFiles()),
          []
        ) ?? []
      );
    }
  }
}
export default DirectoryNode;
