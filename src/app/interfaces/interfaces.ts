export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
  
}

// Define la estructura de la respuesta del login
export interface LoginResponse {
  token: string;
  user: UserData;
}

export interface Brand {
  id: number;
  name: string;
}
