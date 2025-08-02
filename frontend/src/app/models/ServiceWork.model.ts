import {PosteEnum} from "./Poste.model";

export enum ServiceEnum {
  Methode = 'Methode',
  Test = 'Test',
  Maintenance = 'Maintenance',
  // Add more enum values as needed
}

export interface ServiceWork {

  name: ServiceEnum;
}
