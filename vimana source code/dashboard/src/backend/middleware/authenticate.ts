import {Response, NextFunction} from "express";
import {getRepository, Repository} from "typeorm";

import {AdminUser, Request} from "../types";
import {ErrorCode} from "../constants/ErrorCode";
import {Logger, LoggerUtil as LU} from "../util/LoggerUtil";
import {Admin, User} from "../models";
import {ServiceLocator} from "../util/ServiceLocator";
import {HashingUtil} from "../util/HashingUtil";

const logger: Logger = LU.getLogger(__filename);

export function requireTokenPresent(req: Request, res: Response, next: NextFunction): any {
    logger.info(LU.getStartMessage(req.id, "requireTokenPresent", {url: req.url, isAuthenticated: req.isAuthenticated()}));

    if (req.isAuthenticated()) {
       // const user: User = req.session.passport.user as User;
       // if (!user.confirmed
       //     && req.url !== "/terms-conditions"
       //     && req.url !== "/api/dashboard/accept"
       //     && req.url !== "/api/dashboard/balance"
       //     && req.url !== "/api/dashboard/accept-cookie"
       //     && req.url !== "/api/dashboard/user-info") {
       //     if (req.method === "GET") {
       //         logger.warn(LU.getFailMessage(req.id, "requireTokenPresent", "redirected to /terms-conditions", {url: req.url}));
       //         req.release();
       //         return res.redirect("/terms-conditions");
       //     }
       //
       //     logger.warn(LU.getFailMessage(req.id, "requireTokenPresent", "sent AUTH_ERROR", {url: req.url}));
       //     req.release();
       //     return res.json({
       //         success: false,
       //         errorCode: ErrorCode.AUTH_ERROR,
       //     });
       // }

       logger.info(LU.getFinishMessage(req.id, "requireTokenPresent", {isAuthenticated: req.isAuthenticated()}));
       return next();
   }

    if (req.session) {
        req.session.destroy(() => ({}));
    }

    if (req.method === "GET") {
        logger.warn(LU.getFailMessage(req.id, "requireTokenPresent", "redirected to /login", {url: req.url}));
        req.release();
        return res.redirect("/login");
    }

    logger.warn(LU.getFailMessage(req.id, "requireTokenPresent", "sent AUTH_ERROR", {url: req.url}));
    req.release();
    res.json({
        success: false,
        errorCode: ErrorCode.AUTH_ERROR,
    });
}

export function requireTokenAbsent(req: Request, res: Response, next: NextFunction): void {
    logger.info(LU.getStartMessage(req.id, "requireTokenAbsent", {url: req.url, isAuthenticated: req.isAuthenticated()}));

    if (!req.isAuthenticated()) {
        logger.info(LU.getMessage(req.id, "requireTokenAbsent", "not authenticated",
            {isAuthenticated: req.isAuthenticated()}));
        return next();
    }

    if (req.method === "GET") {
        logger.warn(LU.getMessage(req.id, "requireTokenAbsent", "redirected to /dashboard", {url: req.url}));
        req.release();
        return res.redirect("/dashboard");
    }

    logger.info(LU.getFinishMessage(req.id, "requireTokenAbsent", {isAuthenticated: req.isAuthenticated()}));
    return next();
}

export async function adminAuthenticationPresent(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(LU.getStartMessage(req.id, "adminAuthenticationPresent", {url: req.url, admin: req.session.admin}));

    if (req.session.admin) {
        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
        const adminRepo: Repository<Admin> = getRepository(Admin);
        const passportUser: AdminUser = req.session.admin as AdminUser;

        const username: string = hashingUtil.saltAdminUsername("", passportUser.username);
        const count: number = await adminRepo.count({where: {id: passportUser.id, username, verified: true}});
        logger.info(LU.getMessage(req.id, "adminAuthenticationPresent", "counted", {count}));

        if (count === 1) {
            logger.info(LU.getFinishMessage(req.id, "adminAuthenticationPresent", {url: req.url}));
            return next();
        }
    }

    if (req.session) {
        req.session.destroy(() => ({}));
    }

    if (req.method === "GET") {
        logger.warn(LU.getFailMessage(req.id, "adminAuthenticationPresent", "redirected to /admin/signin", {url: req.url}));
        req.release();
        return res.redirect("/admin/signin");
    }

    logger.warn(LU.getFailMessage(req.id, "adminAuthenticationPresent", "sent AUTH_ERROR", {url: req.url}));
    req.release();
    res.json({
        success: false,
        errorCode: ErrorCode.AUTH_ERROR,
    });
}

export async function adminAuthenticationAbsent(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info(LU.getStartMessage(req.id, "adminAuthenticationAbsent", {url: req.url, admin: req.session.admin}));

    const admin: AdminUser = req.session.admin as AdminUser;

    if (!admin) {
        logger.info(LU.getFinishMessage(req.id, "adminAuthenticationAbsent", {url: req.url}));
        return next();
    }

    if (admin) {
        const hashingUtil: HashingUtil = ServiceLocator.getInstance().getHashingUtil();
        const adminRepo: Repository<Admin> = getRepository(Admin);
        const count: number = await adminRepo.count({
            where: {
                id: admin.id || 0,
                username: hashingUtil.saltAdminUsername("", admin.username) || "",
                verified: true,
            },
        });

        logger.info(LU.getMessage(req.id, "adminAuthenticationAbsent", "counted", {count}));

        if (count !== 1) {
            logger.info(LU.getFinishMessage(req.id, "adminAuthenticationAbsent", {url: req.url}));
            return next();
        }
    }

    if (req.method === "GET") {
        logger.warn(LU.getFailMessage(req.id, "adminAuthenticationAbsent", "redirected to /admin/panel", {url: req.url}));
        req.release();
        return res.redirect("/admin/panel");
    }

    return next();
}
