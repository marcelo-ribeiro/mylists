import firebaseClient, {
  create,
  getAllRealtime,
  remove,
  save,
} from "core/client";
import { auth, firestore } from "core/firebase";
import { IItem, IList } from "core/list.model";
import { collection } from "firebase/firestore";

export let listsCollection;

// usersCollection = collection(getFirestore(), "users");
// console.log({ usersCollection });

export const getLists = async (): Promise<IList[]> => {
  const path = `users/${auth.currentUser.uid}/lists`;
  listsCollection = collection(firestore, path);
  const lists = await firebaseClient.getAll(path);
  return lists as IList[];
};

export const getListsRealtime = (callback: (data: any[]) => void) => {
  const path = `users/${auth.currentUser.uid}/lists`;
  return getAllRealtime(path, callback);
};

export const getList = async (listId: string) => {
  return await firebaseClient.get(
    `users/${auth.currentUser?.uid}/lists/${listId}`
  );
};

export const addList = async (data: IList) => {
  const path = `users/${auth.currentUser?.uid}/lists`;
  return create(path, data);
};

export const updateList = async (data: IList) => {
  const path = `users/${auth.currentUser?.uid}/lists`;
  return save(path, data);
};

export const deleteList = async (listId: string) => {
  return listsCollection.doc(listId).delete();
};

//

export const getListItems = async (listId: string) => {
  const items = await firebaseClient.getAll(
    `users/${auth.currentUser?.uid}/lists/${listId}/items`
  );
  return items;
};

export const getListsItemsRealtime = (
  callback: (data: any[]) => void,
  listId: string
) => {
  const path = `users/${auth.currentUser?.uid}/lists/${listId}/items`;
  return getAllRealtime(path, callback);
};

export const addListItem = async (listId: string, { id, ...data }: IItem) => {
  const path = `users/${auth.currentUser?.uid}/lists/${listId}/items`;
  return create(path, data);
};

export const updateListItem = (listId: string, data: IItem) => {
  const path = `users/${auth.currentUser?.uid}/lists/${listId}/items`;
  return save(path, data);
};

export const deleteListItem = async (listId: string, itemId: string) => {
  const path = `users/${auth.currentUser?.uid}/lists/${listId}/items`;
  return remove(path, itemId);
};
