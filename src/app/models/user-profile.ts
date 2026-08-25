export type Role = 'USER'|'ADMIN';
export type Provider = 'PASSWORD'|'GOOGLE';
export type AccountStatus = 'ACTIVE'|'INACTIVE'|'BLOCKED';

export interface UserProfile {
    uid : string;
    name : string;
    email : string;
    role : Role;
    provider : Provider;
    isProfileCompleted : boolean;
    isLogined : boolean;
    accountStatus: AccountStatus;

}
