import { Timestamp } from 'firebase/firestore';
import { Role, Provider, AccountStatus, CurrencyCode } from '../utils/enums'

export interface UserProfile {

    uid: string;
    name: string;
    email: string;

    role: Role;
    provider: Provider;
    status: AccountStatus;

    currency: CurrencyCode;
    country?: string;

    isProfileCompleted: boolean;
    hasAccount: false;

    lastLoginAt?: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}