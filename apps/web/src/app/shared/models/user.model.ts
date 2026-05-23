export type Role = 'ADMIN' | 'AGENT' | 'CUSTOMER';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}
