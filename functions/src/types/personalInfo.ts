interface PhoneNumber {
    countryCode: string;
    number : string;
}

interface PersonalInfo {
    city?: string;
    country?: string;
    linkedIn?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: PhoneNumber;
    currentRole?: string;
    phoneString?: string;
}

export { PersonalInfo };