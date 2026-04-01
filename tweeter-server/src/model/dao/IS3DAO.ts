export interface IS3DAO {
  putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string>; // returns the URL of the uploaded image
}
