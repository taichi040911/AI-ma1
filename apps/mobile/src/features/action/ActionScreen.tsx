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
  fetchCoActions,
  type CoActionFilter,
  type CoActionItem
} from "./api";

const FILTERS: { label: string; params: CoActionFilter }[] = [
  { label: "すべて", params: {} },
  { label: "気軽", params: { difficulty: "easy" } },
  { label: "少人数", params: { group_type: "group" } },
  { label: "イベント", params: { group_type: "event" } }
];

type LoadState = {
  loading: boolean;
  error: string | null;
};

export function ActionScreen() {
  const [state, setState] = useState<LoadState>({ loading: true, error: null });
  const [items, setItems] = useState<CoActionItem[]>([]);
  const [activeFilter, setActiveFilter] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const filterLabel = useMemo(() => FILTERS[activeFilter]?.label ?? "すべて", [
    activeFilter
  ]);

  const loadData = async (filterIndex = activeFilter) => {
    setState({ loading: true, error: null });

    try {
      const response = await fetchCoActions(FILTERS[filterIndex]?.params ?? {});
      setItems(response.data.items);
      setState({ loading: false, error: null });
    } catch (err) {
      if (err instanceof ApiError) {
        setState({ loading: false, error: err.message });
      } else {
        setState({ loading: false, error: "行動候補の取得に失敗しました。" });
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const onFilterPress = async (index: number) => {
    setActiveFilter(index);
    await loadData(index);
  };

  if (state.loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1C1A17" />
        <Text style={styles.loadingText}>Action を読み込み中...</Text>
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

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>Action</Text>
        <Text style={styles.heroTitle}>一緒にやることから始めましょう</Text>
        <Text style={styles.heroDesc}>
          {filterLabel}の行動から、無理のない接点を選べます。
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>フィルター</Text>
        <View style={styles.filterRow}>
          {FILTERS.map((filter, index) => {
            const isActive = index === activeFilter;
            return (
              <Pressable
                key={filter.label}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => onFilterPress(index)}
              >
                <Text
                  style={[styles.filterText, isActive && styles.filterTextActive]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>行動候補</Text>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.sectionBody}>
              該当する行動がありません。フィルターを変更してみてください。
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.cardMeta}>難易度: {item.difficulty}</Text>
                {item.estimated_minutes !== null ? (
                  <Text style={styles.cardMeta}>所要 {item.estimated_minutes} 分</Text>
                ) : null}
              </View>
              <View style={styles.tagRow}>
                {item.best_for.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.cardHint}>AI理由: {item.ai_reason}</Text>
              <Pressable style={styles.cardButton}>
                <Text style={styles.cardButtonText}>詳細を見る</Text>
              </Pressable>
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
    fontSize: 24,
    fontFamily: "Georgia",
    color: "#F7F2EA",
    marginTop: 8
  },
  heroDesc: {
    marginTop: 10,
    fontSize: 12,
    color: "#CBBEAE",
    lineHeight: 18
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D7CFC5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  filterChipActive: {
    backgroundColor: "#1C1A17",
    borderColor: "#1C1A17"
  },
  filterText: {
    fontSize: 12,
    color: "#1C1A17"
  },
  filterTextActive: {
    color: "#F7F2EA"
  },
  emptyState: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF"
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
  cardDesc: {
    marginTop: 6,
    color: "#5D534A",
    lineHeight: 20
  },
  cardMetaRow: {
    flexDirection: "row",
    marginTop: 8
  },
  cardMeta: {
    marginRight: 12,
    fontSize: 12,
    color: "#8B7C6E"
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
  cardHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#7C6E62"
  },
  cardButton: {
    alignSelf: "flex-start",
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1C1A17",
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  cardButtonText: {
    fontSize: 12,
    color: "#1C1A17"
  }
});
