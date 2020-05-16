import {Service, Inject} from 'typedi'
import {IUser} from '../interfaces/IUser'
import IEvaluation from '../interfaces/IEvaluation'

@Service()
export default class EvaluationService {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {}

  public async Add(user: IUser, evaluation: IEvaluation): Promise<IEvaluation> {
    try {
      evaluation.done = false
      evaluation.createdBy = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      }

      const userRecord: IUser = await this.userModel
        .findByIdAndUpdate(
          user._id,
          {
            $push: {evaluations: evaluation},
          },
          {new: true},
        )
        .populate({path: 'evaluations.createdBy', select: '_id name picture'})

      if (!userRecord) {
        throw new Error('Could not add evaluation')
      }

      return userRecord.evaluations[userRecord.evaluations.length - 1] //Get just added evaluation
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Update(
    user: IUser,
    evaluation: IEvaluation,
  ): Promise<IEvaluation> {
    try {
      evaluation.createdBy = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      }

      const userRecord = await this.userModel
        .findOneAndUpdate(
          {
            _id: user._id,
            'evaluations._id': evaluation._id,
          },
          {
            $set: {
              'evaluations.$.subject': evaluation.subject,
              'evaluations.$.evaluationType': evaluation.evaluationType,
              'evaluations.$.date': evaluation.date,
              'evaluations.$.urgency': evaluation.urgency,
              'evaluations.$.description': evaluation.description,
              'evaluations.$.done': evaluation.done,
              'evaluations.$.createdBy': evaluation.createdBy,
            },
          },
          {new: true},
        )
        .populate({path: 'evaluations.createdBy', select: '_id name picture'})

      if (!userRecord) {
        throw new Error('Could not update evaluation')
      }

      return evaluation
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  public async Delete(
    id: string,
    evaluationId: string,
  ): Promise<{user: IUser}> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {
        $pull: {evaluations: {_id: evaluationId}},
      })

      if (!userRecord) {
        throw new Error('Could not delete evaluation')
      }

      return userRecord.toObject()
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}
