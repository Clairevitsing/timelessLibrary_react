export type UserProfileToken = {
    userName: string;
    email: string;
    password: string;
    token: string;
}

export type UserProfile = {
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
