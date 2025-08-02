import { Poste } from './Poste.model';
import {ServiceWork} from './ServiceWork.model';



export interface Worker {
  workerId: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  date: Date;
  phone: string;
  chargeEsd: number;
  postes: Poste[];
  services: ServiceWork[];

}

