export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  _id: string;
  dob: string;
};

export type Product = {
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
  _id: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export type CartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  _id: string;
};

export type Order = {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfoType;
  subtotal: number;
  tax: number;
  total: number;
  shippingCharges: number;
  discount: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};

type CountAndChange = {
  revenue: number;
  order: number;
  product: number;
  user: number;
};
type LatestTransaction = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

export type Stats = {
  latestTransaction: LatestTransaction[];
  userRatio: {
    male: number;
    female: number;
  };
  categoryCount: Record<string, number>[];
  changePercentage: CountAndChange;
  count: CountAndChange;
  chart: { order: number[]; revenue: number[] };
};

type OrderFullFillment = {
  processing: number;
  shipping: number;
  delivered: number;
};
type StockAvailability = {
  instock: number;
  outOfStock: number;
};

type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type UserAge = {
  teen: number;
  adult: number;
  old: number;
};
type AdminCustomers = {
  admin: number;
  customer: number;
};
export type Pie = {
  orderFullfillment: OrderFullFillment;
  productCategories: Record<string, number>[];
  stockAvailability: StockAvailability;
  revenueDistribution: RevenueDistribution;
  usersAgeGroup: UserAge;
  adminCustomers: AdminCustomers;
};

export type Bar = {
  users: number[];
  products: number[];
  orders: number[];
};

export type Line = {
  users: number[];
  products: number[];
  discount: number[];
  revenue: number[];
};
