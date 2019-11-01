import {RandomString} from "../../../src/backend/util/RandomString";

describe("RandomString", (): void => {
    const randomStringUtil: RandomString = new RandomString();

    describe("get random string", (): void => {
        it("should return different strings every time, if `save` option passed", (): void => {
            let flag: boolean = true;
            const values: string[] = [];

            for (let i: number = 0; i < 9999; i++) {
                const randomString: string = randomStringUtil.getRandomString(true);
                flag = flag && !values.includes(randomString);
                values.push(randomString);
            }

            expect(values.length).toEqual(9999);
            expect(flag).toBeTruthy();
        });

        it("should return strings with passed length, if `length` option was passed", (): void => {
            let flag: boolean = true;
            const length: number = 12;

            for (let i: number = 0; i < 1500000; i++) {
                const randomString: string = randomStringUtil.getRandomString(false, length);
                flag = flag && randomString.length === length;
            }

            expect(flag).toBeFalsy();
        });
    });
});
