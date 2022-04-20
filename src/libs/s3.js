import { Storage } from "@aws-amplify/storage";

export default async function uploadToS3(fileName, file, fileType) {
  const pictureKey = await Storage.put(`${fileName}.${fileType}`, file);

  return pictureKey;
}
