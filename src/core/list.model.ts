export interface IList {
  id?: string;
  created?: number;
  updated?: number;
  itemsLength: number;
  name: string;
  total: number;
}

export interface IItem {
  id?: string;
  created?: number;
  updated?: number;
  name: string;
  price: number;
  quantity: number;
  date: string;
  isChecked: boolean;
}
