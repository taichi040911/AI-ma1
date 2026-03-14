import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ApiError } from "../../lib/apiClient";
import {
  fetchCurrentState,
  fetchTodayStep,
  fetchWeeklyPlan
} from "./api";
import { TodayDetailScreen } from "./TodayDetailScreen";

const EMPTY_STATE = "今日の気分や状態を入力してみましょう";

type LoadState = {
  loading: boolean;
  error: string | null;
};

export function TodayHomeScreen() {
  const [state, setState] = useState<LoadState>({ loading: true, error: null });
  const [todayTitle, setTodayTitle] = useState<string | null>(null);
  const [todayDesc, setTodayDesc] = useState<string | null>(null);
  const [todayMinutes, setTodayMinutes] = useState<number | null>(null);
  const [todayReason, setTodayReason] = useState<string | null>(null);
  const [todayActionType, setTodayActionType] = useState<string | null>(null);
  const [todayTargetType, setTodayTargetType] = useState<string | null>(null);
  const [todayTargetId, setTodayTargetId] = useState<string | null>(null);
  const [weeklyTheme, setWeeklyTheme] = useState<string | null>(null);
  const [weeklyComment, setWeeklyComment] = useState<string | null>(null);
  const [weeklySteps, setWeeklySteps] = useState<
    {
      title: string;
      day_hint: string;
      description: string;
      estimated_minutes: number;
      action_type: string;
      target_entity_type: string | null;
      target_entity_id: string | null;
    }[]
  >([]);
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [currentPace, setCurrentPace] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);
  const [showDetailScreen, setShowDetailScreen] = useState(false);

  const summaryText = useMemo(() => {
    if (currentState) {
      return currentState;
    }
    return EMPTY_STATE;
  }, [currentState]);

  const loadData = async () => {
    setState({ loading: true, error: null });

    try {
      const [todayRes, weeklyRes, stateRes] = await Promise.all([
        fetchTodayStep(),
        fetchWeeklyPlan(),
        fetchCurrentState()
      ]);

      setTodayTitle(todayRes.data.title);
      setTodayDesc(todayRes.data.description);
      setTodayMinutes(todayRes.data.estimated_minutes);
      setTodayReason(todayRes.data.reason);
      setTodayActionType(todayRes.data.action_type);
      setTodayTargetType(todayRes.data.target_entity_type);
      setTodayTargetId(todayRes.data.target_entity_id);

      setWeeklyTheme(weeklyRes.data.weekly_theme);
      setWeeklyComment(weeklyRes.data.ai_comment);
      setWeeklySteps(weeklyRes.data.steps);

      setCurrentState(stateRes.data.ai_summary);
      setCurrentFocus(stateRes.data.this_week_focus);
      setCurrentPace(stateRes.data.recommended_pace);
    } catch (err) {
      if (err instanceof ApiError) {
        setState({ loading: false, error: err.message });
      } else {
        setState({ loading: false, error: "データの取得に失敗しました。" });
      }
      return;
    }

    setState({ loading: false, error: null });
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (state.loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1C1A17" />
        <Text style={styles.loadingText}>Today を読み込み中...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{state.error}</Text>
        <Text style={styles.helperText}>下に引っ張って再読み込みできます。</Text>
      </View>
    );
  }

  if (showDetailScreen) {
    return (
      <TodayDetailScreen
        title={todayTitle}
        description={todayDesc}
        estimatedMinutes={todayMinutes}
        reason={todayReason}
        actionType={todayActionType}
        targetType={todayTargetType}
        targetId={todayTargetId}
        weeklyTheme={weeklyTheme}
        weeklyComment={weeklyComment}
        onBack={() => setShowDetailScreen(false)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Today</Text>
        <Text style={styles.heroTitle}>{todayTitle}</Text>
        {todayMinutes !== null ? (
          <Text style={styles.heroMeta}>所要 {todayMinutes} 分</Text>
        ) : null}
        {todayDesc ? <Text style={styles.heroDesc}>{todayDesc}</Text> : null}
        {todayReason ? <Text style={styles.heroReason}>{todayReason}</Text> : null}
        <Pressable style={styles.heroButton} onPress={() => setShowDetailScreen(true)}>
          <Text style={styles.heroButtonText}>詳細を見る</Text>
        </Pressable>
        <Pressable style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>再読み込み</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今週の伴走テーマ</Text>
        <Text style={styles.sectionSubtitle}>{weeklyTheme}</Text>
        {weeklyComment ? <Text style={styles.sectionBody}>{weeklyComment}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今週の伴走プラン</Text>
        {weeklySteps.map((step, index) => (
          <Pressable
            key={`${step.day_hint}-${step.title}`}
            style={styles.planCard}
            onPress={() =>
              setExpandedStepIndex((prev) => (prev === index ? null : index))
            }
          >
            <Text style={styles.planDay}>{step.day_hint}</Text>
            <Text style={styles.planTitle}>{step.title}</Text>
            <Text style={styles.planDesc}>{step.description}</Text>
            <Text style={styles.planMeta}>所要 {step.estimated_minutes} 分</Text>
            <Text style={styles.planLink}>
              {expandedStepIndex === index ? "詳細を閉じる" : "詳細を見る"}
            </Text>
            {expandedStepIndex === index ? (
              <View style={styles.planDetail}>
                <Text style={styles.sectionHint}>種類: {step.action_type}</Text>
                <Text style={styles.sectionHint}>
                  対象: {step.target_entity_type ?? "指定なし"}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今の状態</Text>
        <Text style={styles.sectionBody}>{summaryText}</Text>
        {currentFocus ? (
          <Text style={styles.sectionHint}>今週の焦点: {currentFocus}</Text>
        ) : null}
        {currentPace ? (
          <Text style={styles.sectionHint}>おすすめペース: {currentPace}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F2EA"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F2EA",
    padding: 24
  },
  loadingText: {
    marginTop: 16,
    color: "#4B4239"
  },
  errorText: {
    color: "#B5483F",
    fontSize: 14,
    marginBottom: 8
  },
  helperText: {
    color: "#6D6158",
    fontSize: 12
  },
  hero: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#1C1A17"
  },
  heroLabel: {
    textTransform: "uppercase",
    letterSpacing: 3,
    fontSize: 12,
    color: "#CBBEAE"
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: "Georgia",
    color: "#F7F2EA",
    marginTop: 8
  },
  heroMeta: {
    marginTop: 8,
    color: "#CBBEAE",
    fontSize: 12
  },
  heroDesc: {
    marginTop: 12,
    fontSize: 14,
    color: "#E9E1D6",
    lineHeight: 20
  },
  heroReason: {
    marginTop: 10,
    fontSize: 12,
    color: "#CBBEAE"
  },
  heroButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(247, 242, 234, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  heroButtonText: {
    color: "#F7F2EA",
    fontSize: 12
  },
  refreshButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 12,
    backgroundColor: "rgba(247, 242, 234, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  refreshButtonText: {
    color: "#F7F2EA",
    fontSize: 12
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1A17"
  },
  sectionSubtitle: {
    marginTop: 8,
    fontSize: 20,
    fontFamily: "Georgia",
    color: "#1C1A17"
  },
  sectionBody: {
    marginTop: 8,
    color: "#514940",
    lineHeight: 20
  },
  sectionHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#7C6E62"
  },
  planCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginTop: 12,
    shadowColor: "#1C1A17",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  planDay: {
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 2,
    color: "#8B7C6E"
  },
  planTitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1A17"
  },
  planDesc: {
    marginTop: 6,
    color: "#5D534A",
    lineHeight: 20
  },
  planMeta: {
    marginTop: 8,
    fontSize: 12,
    color: "#8B7C6E"
  },
  planLink: {
    marginTop: 8,
    fontSize: 12,
    color: "#1C1A17",
    textDecorationLine: "underline"
  },
  planDetail: {
    marginTop: 8
  }
});
