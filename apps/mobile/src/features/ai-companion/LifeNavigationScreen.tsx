import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { ApiError } from "../../lib/apiClient";
import {
  answerLifeNavigation,
  startLifeNavigation,
  type DiagnosisQuestion
} from "./api";
import { formatProgress, progressRatio } from "./utils";

const EMPTY_PROGRESS = { current: 1, total: null as number | null };

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
  suggestions?: string[];
};

export function LifeNavigationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<DiagnosisQuestion | null>(null);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [navigated, setNavigated] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    startInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages]);

  const progressLabel = useMemo(
    () => formatProgress(progress.current, progress.total),
    [progress]
  );

  const ratio = useMemo(
    () => progressRatio(progress.current, progress.total),
    [progress]
  );

  const suggestions = currentQuestion?.suggestions ?? [];

  async function startInterview() {
    setLoading(true);
    setError(null);
    setCompleted(false);
    setNavigated(false);
    setInput("");

    try {
      const response = await startLifeNavigation();
      setSessionId(response.data.session_id);
      setCurrentQuestion(response.data.first_question);
      setHint(response.data.current_state_hint);
      setProgress({ current: 1, total: null });
      setMessages([
        {
          id: "q1",
          role: "assistant",
          text: response.data.first_question.text,
          suggestions: response.data.first_question.suggestions
        }
      ]);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("面談の開始に失敗しました。再度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(override?: string) {
    const answer = (override ?? input).trim();
    if (!answer || !sessionId || !currentQuestion || sending) {
      return;
    }

    setSending(true);
    setError(null);
    setInput("");

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      text: answer
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await answerLifeNavigation({
        session_id: sessionId,
        question_code: currentQuestion.code,
        answer_text: answer
      });

      setProgress({
        current: response.data.progress.current,
        total: response.data.progress.total
      });

      if (response.data.next_question) {
        const next = response.data.next_question;
        setCurrentQuestion(next);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            text: next.text,
            suggestions: next.suggestions
          }
        ]);
      } else {
        setCurrentQuestion(null);
        setCompleted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            text: "面談が完了しました。次の画面へ進みましょう。"
          }
        ]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("送信に失敗しました。通信状態をご確認ください。");
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1B1A18" />
        <Text style={styles.loadingText}>AIライフナビを準備中...</Text>
      </View>
    );
  }

  if (error && messages.length === 0) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.primaryButton} onPress={startInterview}>
          <Text style={styles.primaryButtonText}>再試行する</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.header}>
        <Text style={styles.overline}>AI Life Navigation</Text>
        <Text style={styles.title}>対話で今の状態を整理</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}

        <View style={styles.progressRow}>
          <Text style={styles.progressText}>{progressLabel}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.chatContainer}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={
              message.role === "assistant"
                ? styles.assistantBubble
                : styles.userBubble
            }
          >
            <Text
              style={
                message.role === "assistant"
                  ? styles.assistantText
                  : styles.userText
              }
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {completed ? (
        <View style={styles.completionArea}>
          {navigated ? (
            <Text style={styles.successText}>
              次の画面へ遷移した想定です。
            </Text>
          ) : (
            <Pressable
              style={styles.primaryButton}
              onPress={() => setNavigated(true)}
            >
              <Text style={styles.primaryButtonText}>結果へ進む</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <View style={styles.inputArea}>
          <View style={styles.suggestionRow}>
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                style={styles.suggestionChip}
                onPress={() => handleSend(suggestion)}
                disabled={sending}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="自由に入力できます"
              placeholderTextColor="rgba(27, 24, 20, 0.4)"
              style={styles.input}
              editable={!sending}
              multiline
            />
            <Pressable
              style={[styles.sendButton, sending && styles.buttonDisabled]}
              onPress={() => handleSend()}
              disabled={sending || input.trim().length === 0}
            >
              <Text style={styles.sendButtonText}>
                {sending ? "送信中" : "送信"}
              </Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F6F1EA"
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F1EA",
    padding: 24
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#4E473F"
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 12
  },
  overline: {
    textTransform: "uppercase",
    letterSpacing: 2.5,
    fontSize: 12,
    color: "#7C6E62"
  },
  title: {
    fontSize: 24,
    fontFamily: "Georgia",
    color: "#1C1A17",
    marginTop: 6
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: "#5B524A"
  },
  progressRow: {
    marginTop: 12
  },
  progressText: {
    fontSize: 12,
    color: "#7C6E62",
    marginBottom: 6
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(27, 24, 20, 0.1)",
    overflow: "hidden"
  },
  progressFill: {
    height: 6,
    backgroundColor: "#1C1A17"
  },
  chatContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    maxWidth: "85%",
    shadowColor: "#1B1814",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#1C1A17",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    maxWidth: "85%"
  },
  assistantText: {
    color: "#1C1A17"
  },
  userText: {
    color: "#F6F1EA"
  },
  inputArea: {
    borderTopWidth: 1,
    borderTopColor: "rgba(27, 24, 20, 0.08)",
    padding: 16,
    backgroundColor: "#F6F1EA"
  },
  suggestionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10
  },
  suggestionChip: {
    backgroundColor: "#EFE7DD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  suggestionText: {
    fontSize: 12,
    color: "#5B524A"
  },
  inputRow: {
    flexDirection: "row",
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1C1A17"
  },
  sendButton: {
    alignSelf: "flex-end",
    backgroundColor: "#1C1A17",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  sendButtonText: {
    color: "#F6F1EA",
    fontSize: 14
  },
  buttonDisabled: {
    opacity: 0.5
  },
  errorText: {
    color: "#B5483F",
    fontSize: 12,
    marginTop: 8
  },
  completionArea: {
    borderTopWidth: 1,
    borderTopColor: "rgba(27, 24, 20, 0.08)",
    padding: 16,
    backgroundColor: "#F6F1EA"
  },
  primaryButton: {
    backgroundColor: "#1C1A17",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#F6F1EA",
    fontSize: 15
  },
  successText: {
    color: "#2E6B44",
    fontSize: 13
  }
});
