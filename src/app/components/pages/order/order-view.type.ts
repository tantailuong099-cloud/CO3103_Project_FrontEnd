export type OrderItemView = {
  orderItemId: string;
  title: string;
  image: string;
  platform: string;
  version: string;
  quantity: number;
  price: number;
  discount?: number;
  isDigital: boolean;
};
