
export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
}
export interface SimpleUser {
  id: number;
  firstname: string;
  lastname: string;
}

export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ToggleStatusResponse {
  message: string;
  new_status: boolean;
}


export interface SimpleUser {
  id: number;
  firstname: string;
  lastname: string;
}

export interface Address {
  id: number;
  street: string; 
  number: string; 
  address: string;
}


export interface Request {
  id: number;
  user?: SimpleUser; 
  origin_address?: Address; 
  destination_address?: Address; 
  courier?: SimpleUser;
  title: string;
  description?: string;
  payment_method: string;
}


export interface Offer {
  id: number;
  amount: number; 
  price: number; 
  request?: Request;

}
export interface OrderStatus {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  is_completed: boolean;
  order_status_id: number;
  offer: Offer; 
  status?: OrderStatus;
  created_at: string; 
  updated_at: string;
}

export interface EarningsResponse {
  total_earnings: number;
  completed_orders: Order[];
}