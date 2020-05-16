import expressLoader from './express'
import dependencyInjectorLoader from './dependencyInjector'
import mongooseLoader from './mongoose'
import Logger from './logger'
import jobsLoader from './jobs'
import './events'

export default async ({expressApp}) => {
  const mongoConnection = await mongooseLoader()
  Logger.info('✌️ DB loaded and connected!')

  const models = [
    {
      name: 'userModel',
      model: require('../models/user').default,
    },
    {
      name: 'courseModel',
      model: require('../models/course').default,
    },
  ]

  // It returns the agenda instance because it's needed in the subsequent loaders
  const {agenda} = await dependencyInjectorLoader({
    mongoConnection,
    models,
  })
  Logger.info('✌️ Dependency Injector loaded')

  await jobsLoader({agenda})
  Logger.info('✌️ Jobs loaded')

  await expressLoader({app: expressApp, agendaInstance: agenda})
  Logger.info('✌️ Express loaded')
}
