import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

export const getAllProductsService = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Firestore 商品撈取失敗', error);
    throw error;
  }
};

export const getProductByIdService = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    throw new Error('NOT_FOUND');
  } catch (error) {
    console.error(`撈取商品 ${productId} 失敗:`, error);
    throw error;
  }
};

import { addDoc, deleteDoc } from 'firebase/firestore';

export const addProductService = async (productData: any) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    createdAt: new Date().getTime()
  });
  return docRef.id;
};

export const deleteProductService = async (productId: string) => {
  await deleteDoc(doc(db, 'products', productId));
};