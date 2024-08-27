import DirectoryNodeList from "./directoryNodeList";

export const constructDirectoryNodeList = async (
  data: DataTransferItemList,
  rootId: string
) => {
  const directoryTree = new DirectoryNodeList(rootId);
  const promises = Array.from(data).map((file) => {
    const item = file.webkitGetAsEntry(); // for better compatibility
    if (item) return directoryTree.processNode(item);
  });
  await Promise.all(promises);
  return directoryTree;
};