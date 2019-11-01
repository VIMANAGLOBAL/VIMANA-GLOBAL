import identificationType from "../constants/idenfiticationType";

const documents = {
    "2015 Passport Card": identificationType.PASSPORT_CARD,
    "Driving Licence": identificationType.DRIVING_LICENSE,
    "National Identity Card": identificationType.NATIONAL_IDENTITY_CARD,
    "National Identity Card (Aadhaar)": identificationType.NATIONAL_IDENTITY_CARD,
    "Passport": identificationType.PASSPORT,
    "Passport (External)": identificationType.PASSPORT,
    "Passport Card": identificationType.PASSPORT_CARD,
    "Postal ID": identificationType.POSTAL_ID,
    "Professional Qualification ID": identificationType.PROFESSIONAL_QUALIFICATION_ID,
    "Residence Permit": identificationType.RESIDENCE_PERMIT,
    "Residence Permit (Green Card)": identificationType.RESIDENCE_PERMIT,
    "Social Security ID": identificationType.SOCIAL_SECURITY_ID,
    "Tax Identity Card": identificationType.TAX_IDENTITY_CARD,
    "Voter ID": identificationType.VOTER_ID,
    "Voter Identity Card": identificationType.VOTER_IDENTITY_CARD,
    "Work Permit (Authorisation Card)": identificationType.WORK_PERMIT,
    "Work Permit (Employment Card)": identificationType.WORK_PERMIT,
};

export default function (name) {
    return documents[name];
}
