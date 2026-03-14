export type OtpChannel = "email" | "sms";

export type OtpRecord = {
  channel: OtpChannel;
  destination: string;
  code: string;
  expiresAt: number;
  lastSentAt: number;
};

const otpStore = new Map<string, OtpRecord>();

export function makeOtpKey(channel: OtpChannel, destination: string) {
  return `${channel}:${destination}`;
}

export const otpRepository = {
  find(channel: OtpChannel, destination: string) {
    return otpStore.get(makeOtpKey(channel, destination));
  },
  upsert(record: OtpRecord) {
    otpStore.set(makeOtpKey(record.channel, record.destination), record);
    return record;
  },
  reset() {
    otpStore.clear();
  }
};
