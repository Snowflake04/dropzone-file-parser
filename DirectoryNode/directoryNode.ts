interface DirectoryNode {
  name: string;
  isFile: boolean;
  id: string;
  parent: DirectoryNode | null | undefined;
  size: number;
  children?: DirectoryNode[];
  fileCount: number;
  file?: File;
}

export type FileEntry = FileSystemDirectoryEntry | FileSystemFileEntry;

export type Entry = FileEntry & {
  id?: string;
};

class DirectoryNode {
  constructor(entry: Entry, parent?: DirectoryNode | null) {
    this.name = entry.name ?? "root";
    this.isFile = entry.isFile ?? false;
    this.id = entry.id ?? "";
    this.parent = parent;
    this.size = 0;

    if (entry.isFile) {
      (entry as FileSystemFileEntry).file((f: File) => {
        this.file = f;
        this.size = f.size;
        if (this.parent) {
          this.parent.updateSize(f.size);
        }
      });
    } else {
      this.children = [];
      this.fileCount = 0;
    }
  }

  addChild(node: DirectoryNode): void {
    this.children!.push(node);
    if (node.isFile) this.updateFileCount();
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
      return this.children!.reduce(
        (files, child) => files.concat(child.getFiles()),
        [] as DirectoryNode[]
      );
    }
  }
}

export default DirectoryNode;
