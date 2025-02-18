

export type Metadata = {
    name: string;
    bio: string;
    displayName: string;
    profileImage?: string;
    backgroundImage?: string;
}

export type Profile = {
    metadata: Metadata;
}

export type Session = {
    address: string;
    profile: Profile
}

export type AuthReducerState = {
    email: string;
    balance: number;
    currentStep: number;
    isSessionLoading: boolean;
    isLoginModalOpen: boolean;
    isUpdatingMetadata: boolean;
    session: Session;
};