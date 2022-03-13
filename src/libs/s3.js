import Storage from "@aws-amplify/storage";

export default async function uploadToS3(fileName, file, fileType) {
  const pictureKey = await Storage.put(`${fileName}.${fileType}`, file, {
    bucket: process.env.REACT_APP_PROOF_BUCKET,
  });

  return pictureKey;
}
