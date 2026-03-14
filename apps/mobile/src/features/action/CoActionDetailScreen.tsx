import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ApiError } from "../../lib/apiClient";
import {
  fetchCoActionDetail,
  type CoActionDetailResponse,
  type EventRecommendationItem,
  type UserRecommendationItem
} from "./api";

type LoadState = {
  loading: boolean;
  error: string | null;
};

type CoActionDetailScreenProps = {
  actionId: string;
  onBack: () => void;
};

function formatDateRange(event: EventRecommendationItem) {
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "";
  }
  return `${start.toLocaleString()} 〜 ${end.toLocaleString()}`;
}

function renderUserMeta(user: UserRecommendationItem) {
  const meta = [user.age ? `${user.age}歳` : null, user.prefecture].filter(Boolean);
  return meta.join(" / ");
}

export function CoActionDetailScreen({ actionId, onBack }: CoActionDetailScreenProps) {
  const [state, setState] = useState<LoadState>({ loading: true, error: null });
  const [detail, setDetail] = useState<CoActionDetailResponse["data"] | null>(
    null
  );

  const title = useMemo(() => detail?.action.title ?? "共同行動詳細", [detail]);

  const loadDetail = async () => {
    setState({ loading: true, error: null });

    try {
      const response = await fetchCoActionDetail(actionId);
      setDetail(response.data);
      setState({ loading: false, error: null });
    } catch (err) {
      if (err instanceof ApiError) {
        setState({ loading: false, error: err.message });
      } else {
        setState({ loading: false, error: "詳細の取得に失敗しました。" });
      }
    }
  };

  useEffect(() => {
    loadDetail();
  }, [actionId]);

  if (state.loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1C1A17" />
        <Text style={styles.loadingText}>詳細を読み込み中...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>{state.error}</Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>一覧に戻る</Text>
        </Pressable>
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loading}>
        <Text style={styles.helperText}>詳細が見つかりませんでした。</Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>一覧に戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>戻る</Text>
        </Pressable>
        <Text style={styles.headerLabel}>Co-Action Detail</Text>
        <Text style={styles.headerTitle}>{title}</Text>
        {detail.action.estimated_minutes !== null ? (
          <Text style={styles.headerMeta}>所要 {detail.action.estimated_minutes} 分</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>行動の概要</Text>
        <Text style={styles.sectionBody}>{detail.action.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.sectionMeta}>難易度: {detail.action.difficulty}</Text>
        </View>
        <View style={styles.tagRow}>
          {detail.action.best_for.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionHint}>AI理由: {detail.action.ai_reason}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>あなたへの理由</Text>
        <Text style={styles.sectionBody}>{detail.why_for_you}</Text>
        <View style={styles.tagRow}>
          {detail.suitable_connection_modes.map((mode) => (
            <View key={mode} style={styles.tagOutline}>
              <Text style={styles.tagOutlineText}>{mode}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>相性の良いユーザー</Text>
        {detail.matching_users.length === 0 ? (
          <Text style={styles.sectionBody}>まだ候補がありません。</Text>
        ) : (
          detail.matching_users.map((user) => (
            <View key={user.candidate_user_id} style={styles.card}>
              <Text style={styles.cardTitle}>{user.nickname}</Text>
              <Text style={styles.cardMeta}>{renderUserMeta(user)}</Text>
              <Text style={styles.cardMeta}>目的: {user.purposes.join(" / ")}</Text>
              <Text style={styles.cardMeta}>興味: {user.interests.join(" / ")}</Text>
              <View style={styles.cardDivider} />
              <Text style={styles.cardHighlight}>{user.compatibility.summary_label}</Text>
              <Text style={styles.cardDesc}>{user.compatibility.reason_text}</Text>
              <View style={styles.tagRow}>
                {user.compatibility.shared_points.map((point) => (
                  <View key={point} style={styles.tag}>
                    <Text style={styles.tagText}>{point}</Text>
                  </View>
                ))}
              </View>
              {user.next_best_action ? (
                <Text style={styles.sectionHint}>次の一歩: {user.next_best_action}</Text>
              ) : null}
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>関連イベント</Text>
        {detail.matching_events.length === 0 ? (
          <Text style={styles.sectionBody}>イベント候補はありません。</Text>
        ) : (
          detail.matching_events.map((event) => (
            <View key={event.event_id} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardMeta}>
                {event.prefecture} / {event.venue_name}
              </Text>
              <Text style={styles.cardMeta}>{formatDateRange(event)}</Text>
              <Text style={styles.cardMeta}>
                参加 {event.participants_count} / 定員 {event.capacity}
              </Text>
              <Text style={styles.cardDesc}>AI理由: {event.ai_reason}</Text>
            </View>
          ))
        )}
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
    marginBottom: 12
  },
  helperText: {
    color: "#6D6158",
    fontSize: 12
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#1C1A17"
  },
  backButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(247, 242, 234, 0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  backText: {
    color: "#F7F2EA",
    fontSize: 12
  },
  headerLabel: {
    marginTop: 18,
    textTransform: "uppercase",
    letterSpacing: 3,
    fontSize: 12,
    color: "#CBBEAE"
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Georgia",
    color: "#F7F2EA",
    marginTop: 8
  },
  headerMeta: {
    marginTop: 8,
    color: "#CBBEAE",
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
  sectionBody: {
    marginTop: 8,
    color: "#514940",
    lineHeight: 20
  },
  sectionHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#7C6E62"
  },
  sectionMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#5D534A"
  },
  metaRow: {
    marginTop: 8,
    flexDirection: "row"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  tag: {
    backgroundColor: "#F1E9DE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 11,
    color: "#5B5148"
  },
  tagOutline: {
    borderWidth: 1,
    borderColor: "#D7CFC5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6
  },
  tagOutlineText: {
    fontSize: 11,
    color: "#5B5148"
  },
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1C1A17",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1A17"
  },
  cardMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#8B7C6E"
  },
  cardDesc: {
    marginTop: 6,
    color: "#5D534A",
    lineHeight: 20
  },
  cardHighlight: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1A17"
  },
  cardDivider: {
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE5D8"
  }
});
