import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { firestore, storage } from "./firebase";

const transformData = (doc: QueryDocumentSnapshot<DocumentData>) => {
  const data: any = {
    id: doc.id,
    ...doc.data(),
  };
  // !!data.created && (data.created = data.created.toMillis());
  // !!data.updated && (data.updated = data.updated.toMillis());
  return data;
};

const getAll = async (path: string) => {
  const collectionRef = collection(firestore, path);
  const queryRef = query(collectionRef, orderBy("updated", "desc"));
  const response = await getDocs(queryRef);
  console.log({ response });
  return response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAllRealtime = (
  path: string,
  callback: (data: any[]) => void
): Unsubscribe => {
  const collectionRef = collection(firestore, path);
  const queryRef = query(collectionRef, orderBy("created", "desc"));
  const unsubscribe = onSnapshot(queryRef, (snapshot) => {
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    callback?.(data);
  });
  return unsubscribe;
};

const get = async (path: string) => {
  const docRef = doc(firestore, path);
  const docSnap = await getDoc(docRef);
  const data = docSnap.exists() ? transformData(docSnap) : null;
  return data;
};

export const getDocRef = (path: string, id: string) => {
  return doc(firestore, path, id);
};

export const create = async (table: string, data: any) => {
  data.updated = data.created = serverTimestamp();
  return await addDoc(collection(firestore, table), data);
};

export const saveDoc = async (ref: any, data: any) => {
  return await setDoc(ref, {
    ...data,
    created: serverTimestamp(),
    updated: serverTimestamp(),
  });
};

export const save = async (table: string, { id, ...data }: any) => {
  data.updated = serverTimestamp();
  const ref = doc(firestore, table, id);
  await setDoc(ref, data, { merge: true });
};

export const remove = async (path: string, docId: string) => {
  const docRef = doc(firestore, path, docId);
  return await deleteDoc(docRef);
};

export const find = async (
  table: string,
  prop: string,
  value: string[],
  relationships: string[] = []
) => {
  const ref = collection(firestore, table);
  // const q = query(ref, orderBy(prop), startAt(value), endAt(value + '~'));
  // const q = query(ref, where(prop, ">=", value), where(prop, "<=", value + '\uf8ff'));
  const q = query(ref, where(prop, "array-contains-any", value));
  const { docs } = await getDocs(q);
  return docs.map(transformData);
};

export const findByProp = async (path: string, prop: string, value: string) => {
  const collectionRef = collection(firestore, path);
  const queryRef = query(collectionRef, where(prop, "==", value));
  const { docs } = await getDocs(queryRef);
  return docs.map(transformData);
};

export const upload = async (path: string, file: File | Blob) => {
  const storageRef = ref(storage, path);
  const result = await uploadBytes(storageRef, file);
  return await getDownloadURL(result.ref);
};

export const getFiles = async (path: string) => {
  const listRef = ref(storage, path);
  const { items } = await listAll(listRef);
  const result = await Promise.all(items.map((i) => getDownloadURL(i)));
  return result;
};

export default {
  getAll,
  get,
  create,
  remove,
  find,
  findByProp,
  upload,
  getFiles,
  getDocRef,
  saveDoc,
};
