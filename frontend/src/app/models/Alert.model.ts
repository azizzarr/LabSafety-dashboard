export interface Alert {
  last?: boolean;
  id: number;
  title: string;
  message: string;
  timestamp: string | Date ;
  status: string;
  demande: any;
}
