import * as bodyParser from "body-parser";
import * as connectRedis from "connect-redis";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as session from "express-session";
import * as helmet from "helmet";
import * as http from "http";
import * as path from "path";
import * as passport from "passport";
import * as fileUpload from "express-fileupload";
import * as WebSocket from "ws";

import {initRoutes} from "./routes";
import {initPassport} from "./middleware/passport";
import {Server} from "http";

export function initExpressApp() {
    const app: express.Application = express();
    const RedisStore: connectRedis.RedisStore = connectRedis(session);

    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({
        parameterLimit: 100000,
        limit: "50mb",
        extended: true,
    }));
    app.use(session({
        store: new RedisStore({url: process.env.REDIS_URL}),
        cookie: { maxAge: 604800000 },
        saveUninitialized: false,
        secret: "5YibvzlQilPWCnz1uGYh2oJkla0Rlp",
        resave: true,
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(fileUpload());
    initPassport();
    app.use("/assets", express.static(path.join(__dirname, "../../build/email/assets")));
    app.use("/build", express.static(path.join(__dirname, "../../build/frontend")));
    app.use("/doc", express.static(path.join(__dirname, "../../docs")));
    app.engine("ejs", require("ejs").renderFile);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));

    initRoutes(app);

    const server: Server = http.createServer(app);
    const wss = new WebSocket.Server({ port: +(process.env.WS_PORT || 3002), server });

    return {
        server,
        wss,
    };
}
