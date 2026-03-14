import React, { useMemo, useState } from "react";
import {
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
import { updateProfile } from "./api";

const GENDER_OPTIONS = [
  { value: "female", label: "女性" },
  { value: "male", label: "男性" },
  { value: "non_binary", label: "ノンバイナリー" },
  { value: "other", label: "その他" }
];

const DEFAULT_TOKEN = "demo-user";

export function ProfileScreen() {
  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState(GENDER_OPTIONS[0].value);
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      nickname.trim().length > 0 &&
      birthDate.trim().length > 0 &&
      prefecture.trim().length > 0 &&
      gender.trim().length > 0 &&
      token.trim().length > 0
    );
  }, [nickname, birthDate, prefecture, gender, token]);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProfile(
        {
          nickname: nickname.trim(),
          birth_date: birthDate.trim(),
          gender,
          prefecture: prefecture.trim(),
          city: city.trim() || undefined,
          bio: bio.trim() || undefined
        },
        token.trim()
      );

      if (response.data.updated) {
        setSuccess("プロフィールを保存しました。次のステップへ進みます。");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("保存に失敗しました。通信状態をご確認ください。");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.overline}>Onboarding</Text>
          <Text style={styles.title}>基本プロフィールを入力</Text>
          <Text style={styles.subtitle}>
            最初の一歩を整えるために、プロフィールを登録しましょう。
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>APIトークン</Text>
          <Text style={styles.helperText}>
            認証用のトークンを入力してください（デモ用に初期値を設定済み）。
          </Text>
          <TextInput
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            style={styles.input}
            placeholder="Bearer token"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
          />

          <Text style={styles.sectionLabel}>基本情報</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            style={styles.input}
            placeholder="ニックネーム"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
          />
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            style={styles.input}
            placeholder="生年月日 (YYYY-MM-DD)"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
          />

          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.genderChip,
                  gender === option.value && styles.genderChipActive
                ]}
                onPress={() => setGender(option.value)}
              >
                <Text
                  style={
                    gender === option.value
                      ? styles.genderTextActive
                      : styles.genderText
                  }
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={prefecture}
            onChangeText={setPrefecture}
            style={styles.input}
            placeholder="都道府県"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
          />
          <TextInput
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholder="市区町村（任意）"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
          />
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.input, styles.textArea]}
            placeholder="自己紹介（任意）"
            placeholderTextColor="rgba(24, 24, 24, 0.4)"
            multiline
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          <Pressable
            style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
            disabled={!canSubmit || submitting}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>
              {submitting ? "保存中..." : "プロフィールを保存"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            保存後に次の画面へ遷移する導線を追加できます。
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F2EC"
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32
  },
  header: {
    paddingTop: 48,
    paddingBottom: 16
  },
  overline: {
    textTransform: "uppercase",
    letterSpacing: 2.5,
    fontSize: 12,
    color: "#746457",
    marginBottom: 8
  },
  title: {
    fontSize: 30,
    fontFamily: "Georgia",
    color: "#1B1814",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    color: "#5A5149",
    lineHeight: 22
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#1B1814",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 }
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#7A6E64",
    marginBottom: 6,
    marginTop: 12
  },
  helperText: {
    fontSize: 12,
    color: "#8A7E74",
    marginBottom: 10
  },
  input: {
    backgroundColor: "#F4EFE8",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1B1814",
    marginBottom: 12
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top"
  },
  genderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  genderChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#EFE8DE"
  },
  genderChipActive: {
    backgroundColor: "#1B1814"
  },
  genderText: {
    color: "#5A5149",
    fontSize: 12
  },
  genderTextActive: {
    color: "#F5F2EC",
    fontSize: 12
  },
  errorText: {
    color: "#B5483F",
    fontSize: 13,
    marginBottom: 10
  },
  successText: {
    color: "#2E6B44",
    fontSize: 13,
    marginBottom: 10
  },
  primaryButton: {
    backgroundColor: "#1B1814",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4
  },
  buttonDisabled: {
    opacity: 0.5
  },
  primaryButtonText: {
    color: "#F5F2EC",
    fontSize: 16,
    fontWeight: "600"
  },
  footer: {
    marginTop: 16
  },
  footerText: {
    fontSize: 12,
    color: "#8A7E74"
  }
});
