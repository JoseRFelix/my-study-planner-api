import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  console.log('✌️ DB loaded and connected!');

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  const { agenda } = await dependencyInjectorLoader({
    mongoConnection,
    models: [userModel],
  });
  console.log('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  console.log('✌️ Express loaded');
};
