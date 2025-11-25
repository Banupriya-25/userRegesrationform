const express = require('express');
const cors = require('cors');


const { db, admin } = require('./firebase-config'); 

const app = express();
const PORT = 3000;
const USERS_COLLECTION = 'users';


app.use(cors()); 
app.use(express.json()); 


app.post('/api/users', async (req, res) => {
    try {
        
        const userData = req.body;
        
        
        userData.createdAt = admin.firestore.FieldValue.serverTimestamp();

       
        const docRef = await db.collection(USERS_COLLECTION).add(userData);

        res.status(201).json({ 
            id: docRef.id, 
            ...userData 
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Failed to create user.' });
    }
});


app.get('/api/users', async (req, res) => {
    
    try {
        const snapshot = await db.collection(USERS_COLLECTION).get();
        const users = [];
        
        snapshot.forEach(doc => {
           
            users.push({ id: doc.id, ...doc.data() }); 
        });

        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});


app.put('/api/users/:id', async (req, res) => {
    
    try {
        const id = req.params.id;
        const updateData = req.body;
        
        
        await db.collection(USERS_COLLECTION).doc(id).update(updateData);
        
        res.status(200).json({ id: id, message: 'User updated successfully' });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(404).json({ message: 'User not found or update failed.' });
    }
});


app.delete('/api/users/:id', async (req, res) => {
    
    try {
        const id = req.params.id;
        
       
        await db.collection(USERS_COLLECTION).doc(id).delete();
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(404).json({ message: 'User not found or delete failed.' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Node/Express Server running on http://localhost:${PORT}`);
    console.log(`🔥 Connected to Firebase Firestore.`);
});