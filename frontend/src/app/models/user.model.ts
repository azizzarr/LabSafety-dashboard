export interface User {
  userId: any;
  userName: any;
  email: string;
  password: string;
  phone: string; // Add this line
  birthDate: any;
  userPermissions: any;
  last?: boolean; // Add this line
   roles: string[];
}
