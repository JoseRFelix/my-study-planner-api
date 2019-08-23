import * as admin from 'firebase-admin';
import config from '../config';

const serviceAccount = config.firebase;
console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});

export default admin;
