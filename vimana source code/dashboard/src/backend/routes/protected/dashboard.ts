import { Handler, Response } from "express";

import { Route, Request } from "../../types";
import { DashboardController } from "../../controllers/DashboardController";
import {User} from "../../models";
import { ErrorCode } from "../../constants/ErrorCode";
import { HttpMethod } from "../../constants/HttpMethod";
import {Investment, Rates, TransactionHistory, UserInfo} from "../../types/serverResponseType";
import {History, UserInvestment} from "../../types/clientRequestType";
import { ClientRequestConverter } from "../../converter/ClientRequestConverter";
import { Logger, LoggerUtil } from "../../util/LoggerUtil";

export function initDashboardRoutes(): Route[] {
    const logger: Logger = LoggerUtil.getLogger(__filename);

    /**
     * @api {get} /api/dashboard/user-info user info
     * @apiName user info
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {String} payload.firstName user's first name
     * @apiSuccess {String} payload.lastName user's last name
     * @apiSuccess {String} payload.country user's country
     * @apiSuccess {boolean} payload.vip flag that shows is user is vip or not
     * @apiSuccess {boolean} payload.enabled2fa flag that shows is 2fa enabled or not
     * @apiSuccess {String} payload.address user's address
     * @apiSuccess {String} payload.city user's city
     * @apiSuccess {String} payload.state user's state
     * @apiSuccess {String} payload.zipCode user's zipCode
     * @apiSuccess {String} payload.phone user's phone
     * @apiSuccess {String} payload.description user's description
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const userInfo: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "userInfo"));

            const user: User = req.user as User;
            const userInf: UserInfo = await DashboardController.userInfo(req.id, user);

            logger.info(LoggerUtil.getFinishMessage(req.id, "userInfo", { userInf }));

            res.json({
                success: true,
                payload: { ...userInf }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "userInfo", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/dashboard/accept accept terms & conditions
     * @apiName qr
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const accept: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "accept"));

            req.user = await DashboardController.acceptTerms(req.id, req.user as User);

            logger.info(LoggerUtil.getFinishMessage(req.id, "accept", { user: req.user }));

            res.json({
                success: true
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "accept", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/dashboard/balance user balance
     * @apiName user balance
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {number} payload.balance current user"s balance
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const balance: Handler = (req: Request, res: Response): void => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "balance"));

            const bal: number = DashboardController.getBalance(req.id, req.user as User);

            logger.info(LoggerUtil.getFinishMessage(req.id, "balance", { balance: bal }));

            res.json({
                success: true,
                payload: { balance: bal }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "balance", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/dashboard/investment user investment
     * @apiName user investment
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {number} payload.balance current user"s balance
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const investment: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "investment"));

            const invest: Investment = await DashboardController.getInvestment(req.id, req.user as User);

            logger.info(LoggerUtil.getFinishMessage(req.id, "investment", { investment: invest }));

            res.json({
                success: true,
                payload: { investment: invest }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "investment", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/dashboard/rates token rates
     * @apiName token rates
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {number} payload.usd usd rate
     * @apiSuccess {number} payload.btc btc rate
     * @apiSuccess {number} payload.eur eur rate
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const rates: Handler = (req: Request, res: Response): void => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "rates"));

            const rate: Rates = DashboardController.getRates(req.id);

            logger.info(LoggerUtil.getFinishMessage(req.id, "rates", { rate }));

            res.json({
                success: true,
                payload: { ...rate }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "rates", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {get} /api/dashboard/timestamp crowdsale end date
     * @apiName crowdsale end date
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {Date} payload.date crowdsale end date
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`
     */
    const timestamp: Handler = (req: Request, res: Response): void => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "timestamp"));

            const date: Date = DashboardController.getEndTimestamp(req.id);

            logger.info(LoggerUtil.getFinishMessage(req.id, "timestamp", { date }));

            res.json({
                success: true,
                payload: { date }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "timestamp", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/dashboard/save-investment saving the investment
     * @apiName saving the investment
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiParam {number} amount amount of currency
     * @apiParam {string} currency currency type
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `CURRENCY_NOT_VALID`, `AMOUNT_NOT_VALID`
     */
    const saveInvestment: Handler = async (req: Request, res: Response): Promise<void> => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "saveInvestment", {body: req.body}));

            const userInvestment: UserInvestment = ClientRequestConverter.convertInvestment(req.id, req.body);
            await DashboardController.saveInvestment(req.id, userInvestment, req.user as User);

            logger.info(LoggerUtil.getFinishMessage(req.id, "saveInvestment"));

            res.json({
                success: true,
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [ErrorCode.CURRENCY_NOT_VALID, ErrorCode.AMOUNT_NOT_VALID],
                LoggerUtil.getFailMessage(req.id, "saveInvestment", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    /**
     * @api {post} /api/dashboard/history/:page transaction history
     * @apiName transaction history
     * @apiVersion 0.0.1
     * @apiGroup dashboard
     *
     * @apiParam {number} page (in link) current page
     * @apiParam {number} count count of records per page
     *
     * @apiSuccess {boolean} success information about operation success. If false - `errorCode` must be defined.
     * @apiSuccess {Object} payload
     * @apiSuccess {number} payload.count total count of user"s transactions
     * @apiSuccess {Array} payload.history transactions list for current page
     * @apiSuccess {number} payload.history.id transaction id
     * @apiSuccess {String} payload.history.agent
     * @apiSuccess {String} payload.history.transType
     * @apiSuccess {number} payload.history.amount amount of currency spent
     * @apiSuccess {number} payload.history.amountTokens amount of tokens bought
     * @apiSuccess {number} payload.history.bonus bonus percentage for transaction
     * @apiSuccess {number} payload.history.currencyRate rate of spent currency
     * @apiSuccess {String} payload.history.bankId bank id
     * @apiSuccess {Date} payload.history.time transaction time
     * @apiError {String} errorCode code of occurred error. Can be one of: `INTERNAL_ERROR`, `COUNT_NOT_VALID`,
     * `PAGE_NOT_VALID`
     */
    const history: Handler = (req: Request, res: Response): void => {
        try {
            logger.info(LoggerUtil.getStartMessage(req.id, "history", { body: req.body }));

            const historyReq: History = ClientRequestConverter.convertTransactionHistory(
                req.id,
                req.body,
                req.params
            );
            const historyRes: TransactionHistory = DashboardController.getHistory(
                req.id,
                historyReq.count,
                historyReq.page,
                req.user as User
            );

            logger.info(LoggerUtil.getFinishMessage(req.id, "history", { historyRes }));

            res.json({
                success: true,
                payload: { ...historyRes }
            });
        } catch (err) {
            LoggerUtil.error(logger, err, [], LoggerUtil.getFailMessage(req.id, "history", "", {err}));

            res.json({
                success: false,
                errorCode: err.message || ErrorCode.INTERNAL_ERROR
            });
        } finally {
            req.release();
        }
    };

    return [
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/user-info",
            middleware: [],
            handler: userInfo
        },
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/accept",
            middleware: [],
            handler: accept
        },
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/balance",
            middleware: [],
            handler: balance
        },
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/timestamp",
            middleware: [],
            handler: timestamp
        },
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/rates",
            middleware: [],
            handler: rates
        },
        {
            method: HttpMethod.POST,
            path: "/api/dashboard/history/:page",
            middleware: [],
            handler: history
        },
        {
            method: HttpMethod.POST,
            path: "/api/dashboard/save-investment",
            middleware: [],
            handler: saveInvestment,
        },
        {
            method: HttpMethod.GET,
            path: "/api/dashboard/investment",
            middleware: [],
            handler: investment,
        }
    ];
}
