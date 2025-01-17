import { NextFunction, Request, Response } from "express";
import {
  API_RESPONSE_MESSAGES,
  BadRequestErrorCode,
  CreatedSuccessCode,
  OkSuccessCode,
  NotFoundErrorCode,
  UnAuthorizedErrorCode,
  InternalServerErrorCode,
} from "./apiResponseMessages.js";

type ResponseStatus = "success" | "fail" | "error";

type ResponseData = Record<string, unknown> | null;

interface ResponseBody {
  status: ResponseStatus;
  message: string;
  data: ResponseData | null;
  errors?: ApiResponse[];
}

export interface ApiResponse {
  notFound: (code?: NotFoundErrorCode, message?: string) => void;
  ok: (data: ResponseData, code?: OkSuccessCode, message?: string) => void;
  created: (
    data: ResponseData,
    code?: CreatedSuccessCode,
    message?: string,
  ) => void;
  badRequest: (
    errors?: ApiResponse[],
    code?: BadRequestErrorCode,
    message?: string,
  ) => void;
  unAuthorized: (code?: UnAuthorizedErrorCode, message?: string) => void;
  internalError: (code?: InternalServerErrorCode, message?: string) => void;
}

declare module "express-serve-static-core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Response extends ApiResponse {}
}

const apiResponse = (_: Request, res: Response, next: NextFunction) => {
  res.notFound = function (
    code: NotFoundErrorCode = "notFound",
    message = API_RESPONSE_MESSAGES.notFound[code],
  ) {
    this.status(404).send(createResponseBody("fail", message));
  };

  res.ok = function (
    data: ResponseData,
    code: OkSuccessCode = "ok",
    message = API_RESPONSE_MESSAGES.ok[code],
  ) {
    this.status(200).send(createResponseBody("success", message, data));
  };

  res.created = function (
    data: ResponseData,
    code: CreatedSuccessCode = "created",
    message = API_RESPONSE_MESSAGES.created[code],
  ) {
    this.status(201).send(createResponseBody("success", message, data));
  };

  res.badRequest = function (
    errors: ApiResponse[] = [],
    code: BadRequestErrorCode = "badRequest",
    message = API_RESPONSE_MESSAGES.badRequest[code],
  ) {
    this.status(400).send(createResponseBody("fail", message, null, errors));
  };

  res.unAuthorized = function (
    code: UnAuthorizedErrorCode = "unAuthorized",
    message = API_RESPONSE_MESSAGES.unAuthorized[code],
  ) {
    this.status(401).send(createResponseBody("fail", message));
  };

  res.internalError = function (
    code: InternalServerErrorCode = "internalError",
    message = API_RESPONSE_MESSAGES.internalServerError[code],
  ) {
    this.status(500).send(createResponseBody("error", message));
  };

  next();
};

function createResponseBody(
  status: ResponseStatus,
  message: string,
  data: ResponseData = null,
  errors?: ApiResponse[],
) {
  const body: ResponseBody = {
    status,
    message,
    data,
  };
  if (errors) {
    body.errors = errors;
  }
  return body;
}

export default apiResponse;
