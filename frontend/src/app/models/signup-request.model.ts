import {ERole, Role} from "./role.model";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  phone: string; // ena zedhom hedhom
  birthDate: any;
 // roles: Set<string>;
  roles: string[];

}
