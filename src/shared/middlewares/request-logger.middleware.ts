import { INestApplication, Logger } from "@nestjs/common";
import morgan from "morgan";

export function useRequestLogging(app: INestApplication) {
  const logger = new Logger("Request");
  app.use(
    morgan(`:method :url :status - :response-time ms [:date[web]]`, {
      stream: {
        write: message => {
          logger.log(message);
        },
      },
    }),
  );
}
