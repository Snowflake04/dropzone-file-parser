import DirectoryNode from "./directoryNode";
import type { FileEntry } from "./directoryNode";
interface DirectoryNodeList {
    addNode(entry: FileEntry): DirectoryNode;
    processNode(entry: FileEntry): Promise<void>;
    getFiles(): DirectoryNode[];
}
declare class DirectoryNodeList {
    private root;
    private fileCount;
    constructor(rootId: string);
    private parseDirectory;
}
export default DirectoryNodeList;
