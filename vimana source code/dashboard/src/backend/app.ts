import {createConnection} from "./database";
import {initExpressApp} from "./server";
import {Logger, LoggerUtil} from "./util/LoggerUtil";
import {Admin} from "./models";
import {ServiceLocator} from "./util/ServiceLocator";

LoggerUtil.configure(__filename);

const logger: Logger = LoggerUtil.getLogger(__filename);

createConnection()
    .then(async (): Promise<void> => {
        await Admin.seedDefaultAdmin();

        const {server, wss} = initExpressApp();

        ServiceLocator.getInstance().getWsUtil(wss);

        server.listen(process.env.PORT || 3000,
            () => logger.info(LoggerUtil.getMessage("initialize", "start", `App started at port ${process.env.PORT || 3000}`)));
    })
    .catch((err) => logger.error(LoggerUtil.getFailMessage("initialize", "start", "", {err})));
