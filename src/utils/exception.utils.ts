/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostgresException extends Error {
  readonly cause: {
    code: string;
    severity: string;
    constraint?: string;
    detail?: string;
  };
}

export function isPostgresException(error: any): error is PostgresException {
  console.log(error);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return error.cause?.code && error.cause?.severity === "ERROR";
}
