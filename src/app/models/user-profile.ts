import { Timestamp } from 'firebase/firestore';
import { AccountStatus, CurrencyCode, Provider, Role } from '../constants/application-constants';

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

    lastLoginAt?: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}