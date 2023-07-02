export interface Store {
  name: string;
  category: string;
  employees: string[];
}
export interface ApiStore {
  id: string;
  data: Store;
  category: string;
}