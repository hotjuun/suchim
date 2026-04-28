import { supabase } from "./supabase";

export const REPORT_REASONS = [
  "욕설/비방",
  "성적인 내용",
  "혐오 표현",
  "스팸/광고",
  "허위/사기",
  "개인정보 노출",
  "기타",
];

export async function createReport(report: {
  reporter_id: string;
  post_id: string;
  reason: string;
  details?: string;
}) {
  const { data, error } = await supabase
    .from("reports")
    .insert(report)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*, post:posts(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
