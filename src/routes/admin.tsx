import { createFileRoute } from "@tanstack/react-router";
import { Download, LockKeyhole, LogOut, RefreshCw, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminLogin, adminLogout, getAdminSignups } from "@/lib/signups.functions";
import { TIMESLOTS } from "@/lib/tea-quiz";
import { BrandMark } from "@/components/BrandMark";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "신청 현황 | 오당차 운영" },
      { name: "description", content: "오당차 다회 매칭 시간대별 신청 현황 관리 화면입니다." },
      { property: "og:title", content: "신청 현황 | 오당차 운영" },
      { property: "og:description", content: "오당차 다회 매칭 운영 화면" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Signup = {
  id: string;
  name: string;
  contact: string;
  tea_result: string;
  timeslot: string;
  created_at: string;
};

function AdminPage() {
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState<Signup[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = async (quiet = false) => {
    setLoading(true);
    try {
      const data = await getAdminSignups();
      setRows(data);
      setAuthenticated(true);
      if (!quiet) toast.success("신청 현황을 새로 불러왔어요.");
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(true);
  }, []);
  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // adminLogin now returns the signup rows directly in the same response
      // that sets the auth cookie, so the very first screen after a correct
      // password never depends on a second request already carrying that
      // brand-new cookie (that race was what bounced people back to the
      // password screen even with the right password).
      const result = await adminLogin({ data: { password } });
      setRows(result.rows);
      setAuthenticated(true);
      setLoading(false);
      setPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "로그인하지 못했습니다.");
    }
  };
  const grouped = useMemo(
    () => TIMESLOTS.map((time) => ({ time, rows: rows.filter((row) => row.timeslot === time) })),
    [rows],
  );
  const download = () => {
    const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv =
      "\uFEFF시간대,이름,연락처,추천 차,신청 시각\n" +
      rows
        .map((row) =>
          [
            row.timeslot,
            row.name,
            row.contact,
            row.tea_result,
            new Date(row.created_at).toLocaleString("ko-KR"),
          ]
            .map(escape)
            .join(","),
        )
        .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `오당차-신청자-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  if (loading && !authenticated)
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <BrandMark />
        <RefreshCw className="animate-spin text-brand-warm" />
      </div>
    );
  if (!authenticated)
    return (
      <main className="paper-grain flex min-h-dvh items-center justify-center bg-background px-5">
        <BrandMark />
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-brand-deep/10 bg-card p-7 shadow-lift"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
            <LockKeyhole />
          </div>
          <p className="mt-6 text-sm font-bold text-brand-warm">100DADAM STAFF</p>
          <h1 className="mt-2 text-3xl font-black">오당차 운영 현황</h1>
          <p className="mt-2 text-sm text-muted-foreground">운영진 비밀번호를 입력해주세요.</p>
          <label className="mt-7 block text-sm font-bold">
            비밀번호
            <Input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              maxLength={200}
              className="mt-2 h-12 rounded-xl"
            />
          </label>
          <Button className="mt-4 h-12 w-full rounded-xl">현황 보기</Button>
        </form>
      </main>
    );
  return (
    <main className="min-h-dvh bg-background px-4 py-6 sm:px-8">
      <BrandMark />
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-brand-deep/10 pb-6">
          <div>
            <p className="text-sm font-black text-brand-warm">백다담 · 오당차</p>
            <h1 className="mt-1 text-3xl font-black">다회 매칭 신청 현황</h1>
            <p className="mt-2 text-sm text-muted-foreground">총 {rows.length}명 신청</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => load()} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : ""} /> 새로고침
            </Button>
            <Button onClick={download} disabled={!rows.length}>
              <Download /> CSV
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="로그아웃"
              onClick={async () => {
                await adminLogout();
                setAuthenticated(false);
              }}
            >
              <LogOut />
            </Button>
          </div>
        </header>
        <div className="mt-7 grid gap-6 xl:grid-cols-2">
          {grouped.map((group) => (
            <section
              key={group.time}
              className="overflow-hidden rounded-2xl border border-brand-deep/10 bg-card shadow-soft"
            >
              <div className="flex items-center justify-between border-b border-brand-deep/10 p-5">
                <h2 className="text-xl font-black">{group.time}</h2>
                <span className="flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1 text-xs font-bold">
                  <Users className="h-3.5 w-3.5" /> {group.rows.length} / 8
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-secondary/60 text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3">이름</th>
                      <th className="px-5 py-3">연락처</th>
                      <th className="px-5 py-3">추천 차</th>
                      <th className="px-5 py-3">신청 시각</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.length ? (
                      group.rows.map((row) => (
                        <tr key={row.id} className="border-t border-brand-deep/5">
                          <td className="px-5 py-4 font-bold">{row.name}</td>
                          <td className="px-5 py-4">{row.contact}</td>
                          <td className="px-5 py-4">{row.tea_result}</td>
                          <td className="px-5 py-4 text-muted-foreground">
                            {new Date(row.created_at).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">
                          아직 신청자가 없어요.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
