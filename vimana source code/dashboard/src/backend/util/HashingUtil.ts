import * as crypto from "crypto";

export class HashingUtil {
    private readonly salt: string = "a4sdgsdg9670c3casfasf18sdgb9e0ase4tebasff79ngd!sgbg9cfsdgsaf51634fsdgsdgs563d";

    private readonly usernameSalt: string = "af25m225pm2vGE4AF33t23ffdxvbASFWl335Gi33552sdgsg2_websfdbdfbh45436mtnoWRRFfasfasf";
    private readonly passwordSalt: string = "gfewK#535mVEmw424mNWPmOR#Vv)terw9r4353454afaf3mPPF_WRRfafdow@e44455345345gFrwrwvb";

    public saltPassword(reqId: string, password: string): string {
        const sha512: crypto.Hmac = crypto.createHmac("sha512", this.salt);
        sha512.update(password);

        return sha512.digest("hex");
    }

    public saltAdminPassword(reqId: string, password: string): string {
        const sha512: crypto.Hmac = crypto.createHmac("sha512", this.passwordSalt);
        sha512.update(password);

        return sha512.digest("hex");
    }

    public saltAdminUsername(reqId: string, username: string): string {
        const sha512: crypto.Hmac = crypto.createHmac("sha512", this.usernameSalt);
        sha512.update(username);

        return sha512.digest("hex");
    }
}
