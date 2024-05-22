import firebaseClient, {
  create,
  getAllRealtime,
  remove,
  save,
} from "core/client";
import { auth } from "core/firebase";
import { IItem, IList } from "core/list.model";

export const getLists = async (): Promise<IList[]> => {
  const path = `users/${auth.currentUser.uid}/lists`;
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
  const path = `users/${auth.currentUser?.uid}/lists`;
  return remove(path, listId);
};

//

export const getListItems = async (listId: string) => {
  const items = await firebaseClient.getAll(
    `users/${auth.currentUser?.uid}/lists/${listId}/items`
  );
  return items;
};

export const getListsItemsRealtime = (
  listId: string,
  callback: (data: any[]) => void
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
