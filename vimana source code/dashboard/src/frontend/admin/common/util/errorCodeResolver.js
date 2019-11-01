export function resolveErrorCode(errorCode) {
    switch (errorCode) {
        case "WRONG_EMAIL_OR_PASS":
            return "User with these credentials probably doesn't exist";
        default:
            return "Internal program error :c";
    }
}