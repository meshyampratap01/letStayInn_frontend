export enum Roles {
  GUEST = 1,
  KITCHENSTAFF = 2,
  CLEANINGSTAFF = 3,
  ADMIN = 4,
}

export type User = {
  ID: string;
  UserName: string;
  Role: Roles;
};
