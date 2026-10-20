import { Timestamp } from 'firebase/firestore';
import { AccountStatus, CurrencyType, Provider, Role } from '../types/application-types';

export interface UserProfile {

    uid: string;
    name: string;
    email: string;

    role: Role;
    provider: Provider;
    status: AccountStatus;

    currency: CurrencyType;
    country?: string;

    isProfileCompleted: boolean;

    lastLoginAt?: Timestamp | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}