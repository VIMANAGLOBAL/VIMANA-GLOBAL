import {Handler, Request as ExpressRequest} from "express";
import {OnfidoCheckStatus} from "../constants/OnfidoCheckStatus";
import {OnfidoCheckResult} from "../constants/OnfidoCheckResult";

export interface Route {
    method: HTTP_METHOD;
    path: string;
    middleware?: Handler[];
    handler: Handler;
}

export interface Request extends ExpressRequest {
    id: string;
    release: () => void;
    files?: object;
}

export interface AdminUser {
    id: number;
    username: string;
}

export interface OnfidoCheck {
    status: OnfidoCheckStatus;
    result: OnfidoCheckResult;
}

export type HTTP_METHOD = "get" | "post" | "put" | "delete";
