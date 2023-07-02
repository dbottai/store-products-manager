export interface Product {
  id: string;
  data: ProductData;
}

export interface ProductData {
  title: string;
  category: string;
  price: number;
  employee: string;
  description: string;
  reviews: string[];
}
export interface ProductsList {
  list: Product[];
  length: number;
}
