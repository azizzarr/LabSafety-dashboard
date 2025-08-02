export interface Permission {
  id: number;
  name: PermissionName;
  value: boolean;
}

export enum PermissionName {
  // Define your permission names here
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
  WRITE = 'WRITE',
  IMPORT = 'IMPORT',
  READ = 'READ',
}
