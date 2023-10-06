import { NextFunction, Request, Response } from "express"
import { createLogger, transports, format, Logger } from "winston"

const logger = createLogger({
    transports: [
        new transports.Console()
    ]
})


export const requestLogger = ({method, headers, url, app}: Request, response: Response, next: NextFunction) => {

    let logger:Logger = app.get("_requestLogger")
    if(!logger) {
        logger = createLogger({
            transports: [
                new transports.Console()
            ],
            format: format.combine(
                format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
                format.printf((info) => JSON.stringify({
                    method,
                    url,
                    status: response.statusCode,
                    headers
                }))
            )
        })
    }

    response.on("finish", () => {
        logger.info('')
    })

    next()
}