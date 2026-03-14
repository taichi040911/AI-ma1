import type { FastifyError, FastifyInstance } from "fastify";

export type ErrorDetail = Record<string, unknown>;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ErrorDetail[];

  constructor(params: { statusCode: number; code: string; message: string; details?: ErrorDetail[] }) {
    super(params.message);
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.details = params.details;
  }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
      return;
    }

    const fastifyError = error as FastifyError;
    if (fastifyError.validation) {
      const details = fastifyError.validation.map((issue) => ({
        message: issue.message,
        path: issue.instancePath || issue.schemaPath
      }));
      reply.status(400).send({
        success: false,
        error: {
          code: "validation_error",
          message: "Invalid request",
          details
        }
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({
      success: false,
      error: {
        code: "internal_error",
        message: "Internal server error"
      }
    });
  });
}
