import type { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  RegisterRequestSchema,
  RegisterResponseSchema,
  SendOtpRequestSchema,
  SendOtpResponseSchema
} from "../../schemas/auth";
import { ErrorResponseSchema } from "../../schemas/common";
import { registerHandler, sendOtpHandler } from "../../controllers/authController";

export default async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<TypeBoxTypeProvider>();

  typedApp.post(
    "/register",
    {
      schema: {
        body: RegisterRequestSchema,
        response: {
          200: RegisterResponseSchema,
          400: ErrorResponseSchema,
          409: ErrorResponseSchema
        }
      }
    },
    registerHandler
  );

  typedApp.post(
    "/send-otp",
    {
      schema: {
        body: SendOtpRequestSchema,
        response: {
          200: SendOtpResponseSchema,
          400: ErrorResponseSchema,
          429: ErrorResponseSchema
        }
      }
    },
    sendOtpHandler
  );
}
