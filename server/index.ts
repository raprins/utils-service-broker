import { createServer } from "http"
import express, { NextFunction, Request, Response } from "express"
import { OsbApiBroker } from "@raprincis/service-broker"
import { createRequestHandler } from "@remix-run/express";
import path from "node:path"
import DateUtilities, { getFileServiceConfiguration } from "./broker/date-utils.js";
import { requestLogger } from "./shared/logger.js";
import { getApplicationUri } from "./shared/cfenv.js";

const PORT = Number(process.env.PORT || '3000')
const app = express()
const httpServer = createServer(app)

const BUILD = '../build/index.js'
const serviceConfig = getFileServiceConfiguration(path.resolve(process.cwd(), 'configuration.json'))
const dateService = new DateUtilities({
    ...serviceConfig,
    metadata: {
        ...serviceConfig.metadata,
        documentationUrl: `http://${getApplicationUri()}`
    }
}, `http://${getApplicationUri()}/dashboard`)

const broker = OsbApiBroker.create(dateService)

const streamer = (request: Request, response: Response, next: NextFunction) => {

    response.on("finish", () => {
        request.app.emit("brokerHit", {
            method: request.method,
            status: response.statusCode,
            url : request.url,
            body: request.body,
            headers: request.headers
        })
    })

    next()
}


app
    .use(express.static(path.resolve(process.cwd(), 'public')))
    .use("/broker", requestLogger, streamer , broker.handler)
    .get("/streams", (request: Request, response: Response) => {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        response.writeHead(200, headers);

        request.app.on("brokerHit", (message) => {
            const data = `data: ${JSON.stringify(message)}\n\n`;
            response.write(data);
        })
    })
    .get("/health", (request: Request, response: Response) => response.sendStatus(200))
    .all("*",
        createRequestHandler({
            build: await import(BUILD),
            getLoadContext(req, res) {
                return {
                    broker,
                    streamsUri: `https://${getApplicationUri()}/streams`
                };
            },
        })
    )

httpServer.listen(PORT, () => console.log(`App is runing on ${PORT}`))