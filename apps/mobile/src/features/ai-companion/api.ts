import { postJson } from "../../lib/apiClient";

export type DiagnosisQuestion = {
  code: string;
  text: string;
  suggestions: string[];
};

export type LifeNavigationStartResponse = {
  success: boolean;
  data: {
    session_id: string;
    first_question: DiagnosisQuestion;
    current_state_hint: string;
  };
};

export type LifeNavigationAnswerRequest = {
  session_id: string;
  question_code: string;
  answer_text: string;
};

export type LifeNavigationAnswerResponse = {
  success: boolean;
  data: {
    next_question: DiagnosisQuestion | null;
    progress: {
      current: number;
      total: number;
    };
    tentative_state: string | null;
  };
};

export function startLifeNavigation() {
  return postJson<LifeNavigationStartResponse>("/ai/life-navigation/start", {});
}

export function answerLifeNavigation(payload: LifeNavigationAnswerRequest) {
  return postJson<LifeNavigationAnswerResponse>(
    "/ai/life-navigation/answer",
    payload
  );
}
