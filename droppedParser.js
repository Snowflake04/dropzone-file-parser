
import { constructDirectoryNodeList } from "dropzone-file-parser";

const HandleUpload = async (event, location) => {
  const data = event.dataTransfer.items;
  let datas = await constructDirectoryNodeList(data, location);
  console.log(datas);
};
export default HandleUpload;
