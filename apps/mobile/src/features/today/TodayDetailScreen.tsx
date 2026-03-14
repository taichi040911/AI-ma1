import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type TodayDetailScreenProps = {
  title: string | null;
  description: string | null;
  estimatedMinutes: number | null;
  reason: string | null;
  actionType: string | null;
  targetType: string | null;
  targetId: string | null;
  weeklyTheme: string | null;
  weeklyComment: string | null;
  onBack: () => void;
};

export function TodayDetailScreen({
  title,
  description,
  estimatedMinutes,
  reason,
  actionType,
  targetType,
  targetId,
  weeklyTheme,
  weeklyComment,
  onBack
}: TodayDetailScreenProps) {
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>戻る</Text>
        </Pressable>
        <Text style={styles.headerLabel}>Today Detail</Text>
        <Text style={styles.headerTitle}>{title ?? "今日の一歩"}</Text>
        {estimatedMinutes !== null ? (
          <Text style={styles.headerMeta}>所要 {estimatedMinutes} 分</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>概要</Text>
        <Text style={styles.sectionBody}>
          {description ?? "詳細がまだ登録されていません。"}
        </Text>
        {reason ? <Text style={styles.sectionHint}>理由: {reason}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アクション情報</Text>
        <Text style={styles.sectionMeta}>種類: {actionType ?? "未設定"}</Text>
        <Text style={styles.sectionMeta}>対象: {targetType ?? "指定なし"}</Text>
        {targetId ? (
          <Text style={styles.sectionMeta}>ID: {targetId}</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>今週の伴走テーマ</Text>
        <Text style={styles.sectionSubtitle}>{weeklyTheme ?? "未設定"}</Text>
        {weeklyComment ? (
          <Text style={styles.sectionBody}>{weeklyComment}</Text>
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
  sectionMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#5D534A"
  }
});
