import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { IS3DAO } from "../IS3DAO";

const BUCKET = "tweeter-server-deployment-trevorwattles-us-west";
const REGION = "us-west-2";

export class S3ImageDAO implements IS3DAO {
  async putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    const decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };

    const client = new S3Client({ region: REGION });

    try {
      await client.send(new PutObjectCommand(s3Params));
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
