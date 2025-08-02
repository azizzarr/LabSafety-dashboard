export interface AuditLog {
  last: boolean;
  id: number;
  username: string;
  action: string;
  details: string;
  timestamp: string | Date ;
}
