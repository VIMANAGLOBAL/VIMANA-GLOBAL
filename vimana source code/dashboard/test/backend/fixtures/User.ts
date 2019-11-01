import {User} from "../../../src/backend/models";
import {ServiceLocator} from "../../../src/backend/util/ServiceLocator";
import {UserDescription} from "../../../src/backend/constants/UserDescription";

const defaultPass: string = ServiceLocator.getInstance().getHashingUtil().saltPassword("test request id", "password");

export const createUser = (options: any = {}): User => {
    const user: User = new User();

    user.id = options.id || undefined;
    user.firstName = options.firstName || "John";
    user.lastName = options.lastName || "Doe";
    user.email = options.email || `john.doe${Date.now()}@mail.com`;
    user.password = options.password || defaultPass;
    user.country = options.country || "Best Country";
    user.address = options.address || "Best Address";
    user.city = options.city || "Best City";
    user.state = options.state || "Best State";
    user.zipCode = options.zipCode || "Best Zip Code";
    user.phone = options.phone || "+380661234567";
    user.description = options.description || UserDescription.INDIVIDUAL;
    user.secret2fa = options.secret2fa || "AF3AC5WP522MW21";
    user.enabled2fa = options.enable2fa || false;
    user.acceptedCookie = options.acceptedCookie || false;
    user.verified = options.verified || false;

    return user;
};
