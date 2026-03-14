import { randomUUID } from "crypto";
import { AppError } from "../lib/errors";
import {
  lifeNavigationRepository,
  type LifeNavigationQuestion
} from "../repositories/lifeNavigationRepository";

export type LifeNavigationStartResult = {
  session_id: string;
  first_question: LifeNavigationQuestion;
  current_state_hint: string;
};

export type LifeNavigationAnswerInput = {
  session_id: string;
  question_code: string;
  answer_text: string;
};

export type LifeNavigationAnswerResult = {
  next_question: LifeNavigationQuestion | null;
  progress: {
    current: number;
    total: number;
  };
  tentative_state: string | null;
};

export function startLifeNavigation(userId?: string): LifeNavigationStartResult {
  const sessionId = randomUUID();
  const session = lifeNavigationRepository.createSession(sessionId, userId);
  const firstQuestion = lifeNavigationRepository.getQuestion(session.currentQuestionIndex);

  if (!firstQuestion) {
    throw new AppError({
      statusCode: 500,
      code: "life_navigation_unavailable",
      message: "Life navigation questions are not configured"
    });
  }

  return {
    session_id: sessionId,
    first_question: firstQuestion,
    current_state_hint: "あなたの最近の心の動きに注目してみましょう。"
  };
}

export function answerLifeNavigation(
  input: LifeNavigationAnswerInput
): LifeNavigationAnswerResult {
  const session = lifeNavigationRepository.getSession(input.session_id);
  if (!session) {
    throw new AppError({
      statusCode: 400,
      code: "session_not_found",
      message: "Session not found"
    });
  }

  const currentQuestion = lifeNavigationRepository.getQuestion(session.currentQuestionIndex);
  if (!currentQuestion || currentQuestion.code !== input.question_code) {
    throw new AppError({
      statusCode: 400,
      code: "question_mismatch",
      message: "Question code mismatch"
    });
  }

  session.currentQuestionIndex += 1;
  lifeNavigationRepository.updateSession(session);

  const nextQuestion = lifeNavigationRepository.getQuestion(session.currentQuestionIndex);
  const total = lifeNavigationRepository.totalQuestions();

  return {
    next_question: nextQuestion,
    progress: {
      current: Math.min(session.currentQuestionIndex + 1, total),
      total
    },
    tentative_state: null
  };
}
