export enum Roles {
  Invalid = 0,
  GUEST = 1,
  KITCHENSTAFF = 2,
  CLEANINGSTAFF = 3,
  MANAGER = 4,
}

export type User = {
  ID: string;
  UserName: string;
  Role: Roles;
};
