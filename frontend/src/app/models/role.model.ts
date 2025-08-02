export interface Role {
  selected: boolean;
  roleId: number;
  name: string; // Change type to string
}

export enum ERole {
  ROLE_USER = 'ROLE_USER',
  ROLE_RH = 'ROLE_RH',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_EMPLOYE = 'ROLE_EMPLOYE',
}
