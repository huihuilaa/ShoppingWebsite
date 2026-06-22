import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';

export const getCartItemsService = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('UNAUTHENTICATED');
  
  const q = query(
    collection(db, 'carts'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addCartItemService = async (itemData: any) => {
  const docRef = await addDoc(collection(db, 'carts'), itemData);
  return docRef.id;
};

export const removeCartItemService = async (id: string) => {
  await deleteDoc(doc(db, 'carts', id));
};

export const updateCartItemService = async (id: string, data: any) => {
  await updateDoc(doc(db, 'carts', id), data);
};