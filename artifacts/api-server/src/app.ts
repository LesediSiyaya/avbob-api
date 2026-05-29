import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:5000",
    changeOrigin: true,
    pathRewrite: { "^/api": "" },
    on: {
      error: (err, _req, res) => {
        logger.error({ err }, "Proxy error — is the Python backend running on port 5000?");
        if (!("headersSent" in res && res.headersSent)) {
          (res as express.Response).status(502).json({
            error: "Backend unavailable",
            detail: "Python backend is not running on port 5000",
          });
        }
      },
    },
  }),
);

export default app;
