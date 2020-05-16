import {Service, Inject} from 'typedi'
import {IUser} from '../interfaces/IUser'
import IToDo from '../interfaces/IToDo'

@Service()
export default class ToDoService {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {}

  public async Add(user: IUser, toDo: IToDo): Promise<IToDo> {
    try {
      toDo.done = false

      const userRecord: IUser = await this.userModel.findByIdAndUpdate(
        user._id,
        {
          $push: {toDos: toDo},
        },
        {new: true},
      )

      if (!userRecord) {
        throw new Error('Could not add evaluation')
      }

      return userRecord.toDos[userRecord.toDos.length - 1] //Get just added to-do
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Update(user: IUser, toDo: IToDo): Promise<IToDo> {
    try {
      const userRecord = await this.userModel.findOneAndUpdate(
        {
          _id: user._id,
          'toDos._id': toDo._id,
        },
        {
          $set: {
            'toDos.$.task': toDo.task,
            'toDos.$.urgency': toDo.urgency,
            'toDos.$.done': toDo.done,
          },
        },
        {new: true},
      )

      if (!userRecord) {
        throw new Error('Could not update to-do')
      }

      return toDo
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Delete(id: string, toDoId: string): Promise<{user: IUser}> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {
        $pull: {toDos: {_id: toDoId}},
      })

      if (!userRecord) {
        throw new Error('Could not delete to-do')
      }

      return userRecord.toObject()
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
