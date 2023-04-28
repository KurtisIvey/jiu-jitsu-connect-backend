const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: "us-east-1",
});

const BUCKET = process.env.BUCKET;

const uploadToS3 = async (file, fileName) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: `uploads/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  try {
    await s3.send(command);
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const handleFile = (file) => {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const fileUrl = `https://react-node-image-uploads-ki.s3.us-east-1.amazonaws.com/uploads/${fileName}`;

  uploadToS3(file, fileName);
  return fileUrl;
};

module.exports = { handleFile };
