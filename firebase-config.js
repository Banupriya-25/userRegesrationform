
const admin = require('firebase-admin'); 


const serviceAccount = require('./serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:"userdata-248d0"
});

const db = admin.firestore();
module.exports = {
    db, 
    admin 
};