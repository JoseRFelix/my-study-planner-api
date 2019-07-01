import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import cloudinary from '../loaders/cloudinary';

@Service()
export default class UserService {
  constructor(@Inject('userModel') private userModel) {}

  public async UploadProfileImage(user: IUser, image: string): Promise<String> {
    try {
      const result: Express.CloudinaryResult = await cloudinary.uploader.upload(image, {
        width: 200,
        height: 200,
        crop: 'pad',
      });

      if (!result) throw new Error("Could'nt upload image to Cloudinary");

      const userRecord = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            picture: result.secure_url,
          },
        },
        { new: true },
      );

      if (!userRecord) throw new Error("Could'nt add image to user");

      return userRecord.picture;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
