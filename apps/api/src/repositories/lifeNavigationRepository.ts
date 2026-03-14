export type LifeNavigationSession = {
  id: string;
  userId?: string;
  createdAt: number;
  currentQuestionIndex: number;
};

export type LifeNavigationQuestion = {
  code: string;
  text: string;
  suggestions: string[];
};

const sessions = new Map<string, LifeNavigationSession>();

const questionBank: LifeNavigationQuestion[] = [
  {
    code: "LN_Q1",
    text: "最近、どんな瞬間に心が動きましたか？",
    suggestions: ["仕事", "趣味", "人との会話"]
  },
  {
    code: "LN_Q2",
    text: "その時に感じた感情を言葉にすると？",
    suggestions: ["嬉しい", "安心", "ドキドキ"]
  },
  {
    code: "LN_Q3",
    text: "これからの1週間で試したい小さな行動は？",
    suggestions: ["散歩", "新しいカフェ", "オンラインイベント"]
  }
];

export const lifeNavigationRepository = {
  createSession(id: string, userId?: string) {
    const session: LifeNavigationSession = {
      id,
      userId,
      createdAt: Date.now(),
      currentQuestionIndex: 0
    };
    sessions.set(id, session);
    return session;
  },
  getSession(id: string) {
    return sessions.get(id);
  },
  updateSession(session: LifeNavigationSession) {
    sessions.set(session.id, session);
    return session;
  },
  getQuestion(index: number) {
    return questionBank[index] ?? null;
  },
  totalQuestions() {
    return questionBank.length;
  },
  reset() {
    sessions.clear();
  }
};
