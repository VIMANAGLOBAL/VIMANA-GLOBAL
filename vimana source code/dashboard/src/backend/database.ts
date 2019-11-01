import {Connection, createConnection as createTypeormConnection} from "typeorm";

import {User, ResendMap, Verification, Admin, Code, Kyc} from "./models";

export function createConnection(): Promise<Connection> {
    return createTypeormConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: true,
        entities: [
            Kyc,
            Code,
            User,
            Admin,
            ResendMap,
            Verification,
        ],
    });
}
