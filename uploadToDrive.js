import { getApiInstance } from "@controllers/State/Fileman/stateManager";
const api = getApiInstance();
import { AsyncQueue } from "@utils/AsyncQueue";

const queue = new AsyncQueue();

const uploadToDrive = async (fileTree) => {
  fileTree.children.forEach(async (child) => {
    if (child.isFile) {
      handleFileUpload(child, queue);
    } else {
      handleFolderUpload(child, queue);
    }
  });
};

const handleFileUpload = async (child, queue) => {
  await queue.wait();
  if (!child.isFile) return new TypeError("Expected type File, received Directory");
  const file = child.file;
  const formData = new FormData();
  formData.append("file", file);
  let tokenResponse = await api.getUploadToken(child.parent.id);
  console.log(tokenResponse);
  let token = tokenResponse.data;
  if (!token) return new Error(" Failed to create upload token");
  let uploadResponse = await api.uploadFile(formData, token.token);
  console.log(uploadResponse);
  queue.shift();
};

const handleFolderUpload = async (child, queue) => {
  await queue.wait();
  if (child.isFile) return new TypeError("Expected type Directory, received File");
  let newFolder = await createNewFolder(child.parent.id, child.name);
  child.id = newFolder.uuid;
  if (child.children?.length > 0) uploadToDrive(child);
  queue.shift();
};

const createNewFolder = async (parent_uuid, name) => {
  let folderCreateResponse = await api.createNewFolder(parent_uuid, name);
  let folder = folderCreateResponse.data.data;
  if (folder) return folder;
  throw new Error(" failed to create folder: ", folderCreateResponse.status);
};

export default uploadToDrive;
