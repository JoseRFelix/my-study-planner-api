import {Service, Inject} from 'typedi'
import {IUser} from '../interfaces/IUser'
import IHomework from '../interfaces/IHomework'

@Service()
export default class HomeworkService {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {}

  public async Add(user: IUser, homework: IHomework): Promise<IHomework> {
    try {
      homework.done = false
      homework.createdBy = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      }

      const userRecord: IUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          {
            $push: {homework},
          },
          {new: true},
        )
        .populate({path: 'homework.createdBy', select: '_id name picture'})

      if (!userRecord) {
        throw new Error('Could not add homework')
      }

      return userRecord.homework[userRecord.homework.length - 1] //Get just added homework
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Update(user: IUser, homework: IHomework): Promise<IHomework> {
    try {
      homework.createdBy = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      }

      const userRecord = await this.userModel
        .findOneAndUpdate(
          {
            _id: user._id,
            'homework._id': homework._id,
          },
          {
            $set: {
              'homework.$.subject': homework.subject,
              'homework.$.date': homework.date,
              'homework.$.urgency': homework.urgency,
              'homework.$.description': homework.description,
              'homework.$.done': homework.done,
              'homework.$.createdBy': homework.createdBy,
            },
          },
          {new: true},
        )
        .populate({path: 'homework.createdBy', select: '_id name picture'})

      if (!userRecord) {
        throw new Error('Could not update homework')
      }

      return homework
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Delete(id: string, homeworkId: string): Promise<{user: IUser}> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {
        $pull: {homework: {_id: homeworkId}},
      })

      if (!userRecord) {
        throw new Error('Could not delete homework')
      }

      return userRecord.toObject()
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
