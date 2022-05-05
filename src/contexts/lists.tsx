import { IList } from "core/list.model";
import { createContext, useContext, useEffect, useState } from "react";
import { getListsRealtime } from "services/lists";

type ListsContextType = {
  lists: IList[];
};

export const ListsContext = createContext<ListsContextType>(null);

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState<IList[]>(null);

  useEffect(() => {
    console.log("getLists");

    const unsubscribe = getListsRealtime((items) => {
      console.log({ items });
      setLists(items);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ListsContext.Provider value={{ lists }}>{children}</ListsContext.Provider>
  );
};

export const useLists = () => useContext(ListsContext);
