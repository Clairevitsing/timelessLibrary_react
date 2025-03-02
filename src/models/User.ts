export type UserProfileToken = {
  userName: string;
  email: string;
  password: string;
  token: string;
  id?: number; 
}

export type UserDecodedToken = {
  firstName?: string,
  lastName?: string,
  userName?: string;
  email?: string;
  roles?: string[];
  token: string;
  id?: number;
  iat?: number;
  exp?: number;
}

export type UserProfile = {
    id?: number, 
    firstName: string,
    lastName: string,
    userName: string,
    phoneNumber: string,
    email: string,
    password: string,
    roles: string[],
    subStartDate: string,
    subEndDate: string
}

