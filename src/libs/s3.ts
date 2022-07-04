import { Storage } from "@aws-amplify/storage";

export default async function uploadToS3(fileName: string, file: File, fileType: string) {
  const pictureKey = await Storage.put(`${fileName}.${fileType}`, file);

  return pictureKey;
}
