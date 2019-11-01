import path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;


// const loggerFormat = printf(info => {
//     return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
// });


const loggerFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}\n`;
});



function mesasgeComposer(logLabel, level, message) {
    const logger = createLogger({
        format: combine(
            label({ label: logLabel }),
            timestamp(),
            loggerFormat
        ),
        transports: [
            new transports.File({
                filename: path.join(__dirname, `../log/crypto.log`),
                level: 'info'
            }),
            new transports.Console()
        ]
    })
    logger.log({
        label: logLabel,
        level: level,
        message: message
    });
}

function log(logLabel, level, message) {
    mesasgeComposer(logLabel, level, message);


};

export default log;