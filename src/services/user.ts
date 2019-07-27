import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import cloudinary from '../loaders/cloudinary';
import IUserConfig from '../interfaces/IUserConfig';

@Service()
export default class UserService {
  constructor(@Inject('userModel') private userModel : Models.UserModel) {}

  public async UploadProfileImage(user: IUser, image: string): Promise<String> {
    try {
      const result: Express.CloudinaryResult = await cloudinary.uploader.upload(image, {
        width: 200,
        height: 200,
        crop: 'pad',
      });

      if (!result) throw new Error("Couldn't upload image to Cloudinary");

      const userRecord = await this.userModel.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            picture: result.secure_url,
          },
        },
        { new: true },
      );

      if (!userRecord) throw new Error("Couldn't add image to user");

      return userRecord.picture;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async ChangeConfig(_id: string, config: IUserConfig): Promise<IUserConfig> {
    try {
      
      const userRecord: IUser = await this.userModel.findOneAndUpdate(
        { _id },
        {
          $set: {
            'configuration.darkMode': config.darkMode,
          },
        },
        { new: true },
      );

      if (!userRecord) throw new Error("Couldn't update User");

      return userRecord.configuration;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
