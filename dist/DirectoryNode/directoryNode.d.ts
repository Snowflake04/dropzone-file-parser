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
declare class DirectoryNode {
    constructor(entry: Entry, parent?: DirectoryNode | null);
    addChild(node: DirectoryNode): void;
    updateSize(size: number): void;
    updateFileCount(): void;
    getFiles(): DirectoryNode[];
}
export default DirectoryNode;
