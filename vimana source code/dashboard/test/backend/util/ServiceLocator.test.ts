import {ServiceLocator} from "../../../src/backend/util/ServiceLocator";
import {HashingUtil} from "../../../src/backend/util/HashingUtil";
import {Validator} from "../../../src/backend/util/validator/Validator";
import {RandomString} from "../../../src/backend/util/RandomString";

describe("ServiceLocator", (): void => {
    describe("locator", (): void => {
        it("should return services instances", (): void => {
            const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
            const validator: Validator = ServiceLocator.getInstance().getValidator();

            expect(hashingUtil).toBeDefined();
            expect(validator).toBeDefined();
        });

        it("should always return same service objects", (): void => {
            const oneRandomString: RandomString = ServiceLocator.getInstance().getRandomStringUtil();
            const otherRandomString: RandomString = ServiceLocator.getInstance().getRandomStringUtil();

            expect(oneRandomString).toBeDefined();
            expect(otherRandomString).toBeDefined();
            expect(oneRandomString).toStrictEqual(otherRandomString);
        });

        it("should always return same locator objects", (): void => {
            const oneValue: ServiceLocator = ServiceLocator.getInstance();
            const otherValue: ServiceLocator = ServiceLocator.getInstance();

            expect(oneValue).toBeDefined();
            expect(otherValue).toBeDefined();
            expect(oneValue).toStrictEqual(otherValue);
        });
    });
});
