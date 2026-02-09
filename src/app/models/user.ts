export enum Roles {
  Invalid = 'Invalid',
  GUEST = 'Guest',
  KITCHENSTAFF = 'KitchenStaff',
  CLEANINGSTAFF = 'CleaningStaff',
  MANAGER = 'Manager',
}


export type User = {
  ID: string;
  UserName: string;
  Role: Roles;
};

export type profileDTO = {
  id: string,
  name: string,
  email: string,
  role: string,
  available: boolean,
}