import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, orderBy, where, doc, setDoc } from 'firebase/firestore';

export const getUserOrdersService = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('UNAUTHENTICATED');
  }

  const q = query(
    collection(db, 'orders'),
    where('userId', '==', currentUser.uid),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const createOrderService = async (orderData: any, customId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('UNAUTHENTICATED');
  }
  
  await setDoc(doc(db, 'orders', customId), orderData);
  
  return customId;
};