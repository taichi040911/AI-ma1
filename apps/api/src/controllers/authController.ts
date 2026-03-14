import type { Static } from "@sinclair/typebox";
import type { FastifyRequest } from "fastify";
import {
  RegisterRequestSchema,
  SendOtpRequestSchema
} from "../schemas/auth";
import { registerUser, sendOtp } from "../services/authService";

type RegisterBody = Static<typeof RegisterRequestSchema>;
type SendOtpBody = Static<typeof SendOtpRequestSchema>;

export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterBody }>
) {
  const result = registerUser(request.body);

  return {
    success: true,
    data: result
  };
}

export async function sendOtpHandler(
  request: FastifyRequest<{ Body: SendOtpBody }>
) {
  const result = sendOtp(request.body);

  return {
    success: true,
    data: result
  };
}
