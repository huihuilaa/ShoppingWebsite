import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const getUserOrdersService = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('UNAUTHENTICATED');
  }

  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};