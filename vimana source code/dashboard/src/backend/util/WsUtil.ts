import * as WebSocket from "ws";
import {Logger, LoggerUtil as LU} from "./LoggerUtil";

const logger: Logger = LU.getLogger(__filename);

export class WsUtil {
    private readonly wss;

    private socket2userIdMap: Map<WebSocket, number> = new Map<WebSocket, number>();
    private userId2socketMap: Map<number, WebSocket> = new Map<number, WebSocket>();

    constructor(wss) {
        this.wss = wss;

        wss.on("connection", (ws: WebSocket) => {
            console.info('socket connect');
            ws.on("message", (message) => {
                console.info(`socket message: ${message}`);
                this.socket2userIdMap.set(ws, +message);
                this.userId2socketMap.set(+message, ws);
            });
            ws.on("close", () => {
                console.info("socket close");
                const userId: number = this.socket2userIdMap.get(ws);
                console.info(userId);
                this.socket2userIdMap.delete(ws);
                this.userId2socketMap.delete(userId);
            });
        });
    }

    public async send(reqId: string, userId: number, action: string): Promise<void> {
        console.info(LU.getStartMessage(reqId, "send", {userId, action}));

        if (this.userId2socketMap.has(userId)) {
            console.info(LU.getMessage(reqId, "send", "user is online"));
            this.userId2socketMap.get(userId).send(action);
        }

        console.info(LU.getFinishMessage(reqId, "send"));
    }
}
