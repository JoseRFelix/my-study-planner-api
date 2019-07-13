import * as admin from 'firebase-admin';

const serviceAccount = require('../../firebaseServiceKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
