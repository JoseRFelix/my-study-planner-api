import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import IEvaluation from '../interfaces/IEvaluation';

@Service()
export default class EvaluationService {
  constructor(@Inject('userModel') private userModel) {}

  public async Add(id: string, evaluation: IEvaluation): Promise<{ user: IUser }> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {
        $push: { evaluations: evaluation },
      });

      if (!userRecord) {
        throw new Error('Could not add evaluation');
      }

      return userRecord;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
