// src/services/findUserEntries.mjs
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getDb, getAuthInstance } from './db.mjs';

const collectionName = 'Results';

export const findUserEntries = async () => {
    const auth = getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("No user is currently logged in");
    }

    const userEmail = user.email;
    const q = query(collection(getDb(), collectionName), where("email", "==", userEmail));
    
    try {
        const docRefs = await getDocs(q);
        const res = [];

        docRefs.forEach(doc => {
            const data = doc.data();
            res.push({
                id: doc.id, // Adding the document ID
                filename: data.filename,
                result: data.result,
                datetime: data.datetime
            });
        });

        return res;
    } catch (error) {
        console.error("Error fetching user entries:", error);
        throw new Error("Failed to fetch user entries");
    }
};
