import {RecoverLetterData, VerificationLetterData} from "../../../src/backend/types/letterDataType";
import {LetterDataConverter} from "../../../src/backend/converter/LetterDataConverter";

describe("LetterDataConverter", (): void => {
    const reqId: string = "test request id";
    process.env.SERVER_URL = "SERVER_URL";

    it("should convert verification letter data", (): void => {
        const code: string = "TEST_CODE";
        const res: VerificationLetterData = LetterDataConverter.convertVerificationLetterData(reqId, code);

        expect(res).toBeDefined();
        expect(res.link).toBeDefined();
        expect(res.link).toEqual("SERVER_URL/api/signup/verify-email?code=TEST_CODE");
    });

    it("should convert recover letter data", (): void => {
        const password: string = "TEST_PASSWORD";
        const res: RecoverLetterData = LetterDataConverter.convertRecoverLetterData(reqId, password);

        expect(res).toBeDefined();
        expect(res.password).toBeDefined();
        expect(res.password).toEqual(password);
    });
});
