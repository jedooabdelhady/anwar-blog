import { writeClient } from "@/sanity/lib/client";

export type UserSubmission = {
  _id: string;
  kind?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
  status?: string;
  accessToken?: string;
  replyMessage?: string;
  replySentAt?: string;
};

type Fetcher = <T = unknown>(query: string, params?: Record<string, unknown>) => Promise<T>;

const FIELDS = `{
  _id, kind, subject, message, createdAt, status, accessToken, replyMessage, replySentAt
}`;

export async function getSubmissionsForUser(
  userId: string
): Promise<UserSubmission[]> {
  const query = `*[_type == "submission" && user._ref == $uid] | order(createdAt desc)${FIELDS}`;
  const fetch = (writeClient as unknown as { fetch: Fetcher }).fetch.bind(
    writeClient
  );
  try {
    return await fetch<UserSubmission[]>(query, { uid: userId });
  } catch (err) {
    console.warn("[submissions] getSubmissionsForUser failed:", err);
    return [];
  }
}
