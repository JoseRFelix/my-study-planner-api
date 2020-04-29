import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import IEvaluation from '../interfaces/IEvaluation';
import { ICourse } from '../interfaces';

@Service()
export default class CourseService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('courseModel') private courseModel: Models.CourseModel,
  ) {}

  public async get(user: IUser): Promise<ICourse[]> {
    try {
      let courseRecords = await this.courseModel
        .find({ members: user._id })
        .select('name schedule members homework evaluations createdBy');

      if (!courseRecords) {
        throw new Error("Cannot get user's courses");
      }

      return courseRecords;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async getById(id: string) {
    try {
      let courseRecord = await this.courseModel
        .findById(id)
        .select('name schedule members homework evaluations createdBy');

      if (!courseRecord) {
        throw new Error('Cannot get course');
      }

      return courseRecord;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async Add(user: IUser, course: ICourse): Promise<ICourse> {
    try {
      course.createdBy = {
        _id: user._id,
        name: user.name,
        picture: user.picture,
      };
      course.members = [course.createdBy];

      let courseRecord = await this.courseModel.create(course);

      Reflect.deleteProperty(courseRecord, 'updatedAt');
      Reflect.deleteProperty(courseRecord, 'createdAt');

      if (!courseRecord) {
        throw new Error('Course cannot be created');
      }

      return courseRecord;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async Update(user: IUser, course: ICourse): Promise<ICourse> {
    try {
      Reflect.deleteProperty(course, 'createdBy');
      Reflect.deleteProperty(course, 'members');

      const response = await this.courseModel
        .findOneAndUpdate(
          {
            _id: course._id,
            members: user._id,
          },
          course,
          { new: true },
        )
        .select('name schedule members homework evaluations createdBy');

      if (!response) {
        throw new Error('Could not update evaluation');
      }

      return course;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async Delete(
    userId: string,
    courseId: string,
  ): Promise<
    {
      ok?: number;
      n?: number;
    } & {
      deletedCount?: number;
    }
  > {
    try {
      const response = await this.courseModel.deleteOne({ _id: courseId, members: userId });

      if (!response) {
        throw new Error('Could not delete evaluation');
      }

      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
