import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { SLOT_CAPACITY, TEAS, TIMESLOTS } from "./tea-quiz";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(50),
  contact: z.string().trim().min(2).max(100),
  teaResult: z.enum(TEAS),
  timeslot: z.enum(TIMESLOTS),
});
const passwordSchema = z.object({ password: z.string().min(1).max(200) });
const COOKIE = "odangcha_admin";

function secureEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
function token(secret: string) { return createHmac("sha256", secret).update("odangcha-admin-v1").digest("hex"); }
function assertAdmin(secret: string) {
  const cookie = getRequestHeader("cookie") ?? "";
  const stored = cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!stored || !secureEqual(stored, token(secret))) throw new Error("관리자 인증이 필요합니다.");
}

export const getSlotCounts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("signups").select("timeslot");
  if (error) throw new Error("시간대 정보를 불러오지 못했습니다.");
  return TIMESLOTS.map((time) => ({ time, count: data.filter((row) => row.timeslot === time).length, capacity: SLOT_CAPACITY }));
});

export const submitSignup = createServerFn({ method: "POST" })
  .inputValidator((input) => signupSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: inserted, error } = await supabaseAdmin.rpc("reserve_tea_timeslot", {
      p_name: data.name, p_contact: data.contact, p_tea_result: data.teaResult,
      p_timeslot: data.timeslot, p_capacity: SLOT_CAPACITY,
    });
    if (error?.message.includes("timeslot_full")) throw new Error("선택한 시간대가 방금 마감되었어요.");
    if (error) throw new Error("신청을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
    return { signup: Array.isArray(inserted) ? inserted[0] : inserted };
  });

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) => passwordSchema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env['ADMIN_PASSWORD'];
    if (!secret || !secureEqual(data.password, secret)) throw new Error("비밀번호가 올바르지 않습니다.");
    setResponseHeader("Set-Cookie", `${COOKIE}=${token(secret)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800; Secure`);
    return { ok: true };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  setResponseHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`);
  return { ok: true };
});

export const getAdminSignups = createServerFn({ method: "GET" }).handler(async () => {
  const secret = process.env['ADMIN_PASSWORD'];
  if (!secret) throw new Error("관리자 비밀번호가 설정되지 않았습니다.");
  assertAdmin(secret);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("signups").select("id,name,contact,tea_result,timeslot,created_at").order("timeslot").order("created_at");
  if (error) throw new Error("신청 목록을 불러오지 못했습니다.");
  return data;
});
