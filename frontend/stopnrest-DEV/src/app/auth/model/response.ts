export interface User {
  id: string;
  userName: string;
  email: string;
  contact: number;
  createdAt: string;
  updatedAt: string;
  profilePic: string | null;
  active: boolean;
  role:string;
}

export interface ApiResponse {
  user: User;
  token: string;
}