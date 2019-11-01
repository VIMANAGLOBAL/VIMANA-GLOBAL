import * as passport from "passport";
import * as speakeasy from "speakeasy";

import {getRepository, Repository} from "typeorm";
import {IVerifyOptions, Strategy as LocalStrategy} from "passport-local";

import {User} from "../models";
import {ErrorCode} from "../constants/ErrorCode";
import {HashingUtil} from "../util/HashingUtil";
import {ServiceLocator} from "../util/ServiceLocator";
import {Request} from "../types";

declare type DoneFunc = (error: any, user?: User, options?: IVerifyOptions) => void;
declare type DoneSerializeFunc = (err: any, id?: User) => void;
declare type DoneDeserializeFunc = (err: any, user?: User) => void;

export function initPassport(): void {
    const userRepo: Repository<User> = getRepository(User);
    const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();

    passport.serializeUser<User, User>((user: User, done: DoneSerializeFunc): void => {
        done(null, user);
    });

    passport.deserializeUser<User, User>((user: User, done: DoneDeserializeFunc): void => {
        done(null, user);
    });

    passport.use("local", new LocalStrategy({usernameField: "email"},
        async (email: string, password: string, done: DoneFunc): Promise<void> => {
            try {
                const pass: string = hashingUtil.saltPassword("", password);
                const users: User[] = await userRepo.find({where: {email, password: pass, verified: true}});

                if (users && users.length) {
                    const user: User = users[0];
                    if (user.enabled2fa) {
                        done(null, null, {message: ErrorCode.REQUIRED_2FA});
                    } else {
                        done(null, user);
                    }
                } else {
                    done(null, null, {message: ErrorCode.WRONG_EMAIL_OR_PASS});
                }
            } catch (err) {
                done(err);
            }
        },
    ));

    passport.use("2fa", new LocalStrategy({usernameField: "email", passReqToCallback: true},
        async (req: Request, email: string, password: string, done: DoneFunc): Promise<void> => {
            try {
                const pass: string = hashingUtil.saltPassword("", password);
                const users: User[] = await userRepo.find({where: {email, password: pass, verified: true}});

                const token: string = req.body.token;

                if (users && users.length) {
                    const user: User = users[0];

                    const verified: boolean = speakeasy.totp.verify({
                        secret: user.secret2fa,
                        encoding: "base32",
                        token,
                    });

                    if (!token || !verified) {
                        done(null, null, {message: ErrorCode.WRONG_TOKEN});
                    } else {
                        done(null, user);
                    }
                } else {
                    done(null, null, {message: ErrorCode.WRONG_EMAIL_OR_PASS});
                }
            } catch (err) {
                done(err);
            }
        }));
}
