export enum PosteEnum {
  CMS1 = 'CMS1',
  CMS2 = 'CMS2',
  CMS3 = 'CMS3',
  Integration = 'Integration',
  // Add more enum values as needed
}

export interface Poste {
  //PosteId: number; // Corresponding to the ID in the Java entity
  name: PosteEnum;
}
