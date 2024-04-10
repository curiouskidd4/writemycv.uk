
interface User {
    email: string;
    firebaseId: string;
    firstName: string;
    isRepoCompleted: boolean;
    lastName: string;
    photoURL: string;
    profileCompleted: boolean;
    username: string;
    isHowellUser?: boolean;
    subscriptionId?: string;
}

export {User};