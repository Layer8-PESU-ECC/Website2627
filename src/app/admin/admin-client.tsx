"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/auth-context";
import { formatToIST } from "@/lib/date";
import ExportControls from "./ExportControls";

type Tab = "dashboard" | "users" | "audit" | "submissions";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "dashboard" },
  { id: "users", label: "users" },
  { id: "audit", label: "audit logs" },
  { id: "submissions", label: "submissions" },
];

interface AdminUser {
  srn: string;
  name: string;
  role: "admin" | "member";
  branch: string;
  semester: string;
  program?: string;
  section?: string;
  email?: string;
  phone?: string;
  campus?: string;
  created_at?: string;
  last_login?: string;
}

interface AuditLog {
  id: number;
  srn: string;
  user_type: string;
  action: string;
  detail: string | null;
  created_at: string;
}

interface ActivityItem {
  type: "audit" | "application";
  srn: string;
  action: string;
  created_at: string;
}

interface Stats {
  metrics: { totalUsers: number; totalSubmissions: number };
  activity: ActivityItem[];
}

interface Submission {
  id: string;
  user_srn: string;
  fullName: string;
  srn: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  domains: string[];
  domainAnswers: Record<string, unknown> | null;
  experience: string | null;
  portfolioUrl: string | null;
  whyJoin: string | null;
  feedback: string | null;
  createdAt: string;
  [key: string]: unknown;
}

function getInitialTab(): Tab {
  if (typeof window === "undefined") return "dashboard";
  const hash = window.location.hash.replace("#", "");
  if (TABS.some((t) => t.id === hash)) return hash as Tab;
  return "dashboard";
}

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [loadingData, setLoadingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    // Sync the active tab from the URL hash on mount and on back/forward
    // navigation — window.location isn't available at render time (SSR),
    // so this has to happen in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTab(getInitialTab());
    function onHashChange() {
      setTab(getInitialTab());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function selectTab(next: Tab) {
    setTab(next);
    // Only ever invoked from a tab button's onClick, never during render —
    // safe to write to the URL hash here so it stays deep-linkable.
    // eslint-disable-next-line react-hooks/immutability
    window.location.hash = next;
  }

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setFetchError(null);
    try {
      const [usersRes, logsRes, statsRes, submissionsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/audit-logs"),
        fetch("/api/admin/stats"),
        fetch("/api/admin/submissions"),
      ]);

      if (
        !usersRes.ok ||
        !logsRes.ok ||
        !statsRes.ok ||
        !submissionsRes.ok
      ) {
        setFetchError("failed to load one or more admin resources");
      }

      const [usersData, logsData, statsData, submissionsData] = await Promise.all([
        usersRes.json().catch(() => ({})),
        logsRes.json().catch(() => ({})),
        statsRes.json().catch(() => ({})),
        submissionsRes.json().catch(() => ({})),
      ]);

      setUsers(usersData.users ?? []);
      setLogs(logsData.logs ?? []);
      setStats(statsData.metrics ? statsData : null);
      setSubmissions(submissionsData.submissions ?? []);
    } catch {
      setFetchError("could not reach the admin API");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      // Fetch-on-mount/role-change — the standard pattern for syncing
      // this component with the admin API's server state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/recruitments/login");
    }
  }, [isLoading, user, router]);

  async function toggleRole(srn: string) {
    if (
      !window.confirm(
        `Change ${srn}'s role? This changes what they can access.`,
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${srn}/role`, { method: "PATCH" });
      if (!res.ok) {
        setFetchError("could not change that user's role. try again.");
        return;
      }
      await fetchData();
    } catch {
      setFetchError("could not reach the admin API.");
    }
  }

  async function deleteSubmission(id: string) {
    if (!window.confirm("Delete this application permanently? This can't be undone.")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setFetchError("could not delete that submission. try again.");
        return;
      }
      await fetchData();
    } catch {
      setFetchError("could not reach the admin API.");
    }
  }

  async function clearLogs() {
    if (
      !window.confirm(
        "Clear the entire audit log? This wipes every past entry and can't be undone.",
      )
    ) {
      return;
    }
    try {
      const res = await fetch("/api/admin/audit-logs", { method: "DELETE" });
      if (!res.ok) {
        setFetchError("could not clear the audit log. try again.");
        return;
      }
      await fetchData();
    } catch {
      setFetchError("could not reach the admin API.");
    }
  }

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <p className="text-fg-dim">loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="term max-w-md">
            <div className="term-bar">
              <div className="term-dots">
                <span className="term-dot" />
                <span className="term-dot" />
                <span className="term-dot" />
              </div>
              <span className="term-title">403</span>
            </div>
            <div className="term-body">
              <p style={{ color: "var(--danger)" }}>
                {"> 403 forbidden"}
              </p>
              <p className="text-fg-dim mt-2">
                you are authenticated as {user.srn}, but this area requires
                the admin role.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="mb-6">
          <Link href="/recruitments" className="btn mb-4 inline-flex">
            &lt; back_to_recruitments
          </Link>
          <br />
          <span className="kicker">admin</span>
          <h1 className="text-2xl font-display mt-2">control_panel</h1>
        </div>

        <div className="admin-tabs items-center">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-tab ${tab === t.id ? "admin-tab-active" : ""}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <button
            className="admin-tab ml-auto"
            onClick={fetchData}
            disabled={loadingData}
          >
            {loadingData ? "↻ refreshing..." : "↻ refresh"}
          </button>
        </div>

        {fetchError && <p className="field-error mb-4">{fetchError}</p>}

        {tab === "dashboard" && (
          <DashboardTab stats={stats} loading={loadingData} />
        )}

        {tab === "users" && (
          <UsersTab
            users={users}
            currentSrn={user.srn}
            onToggleRole={toggleRole}
            loading={loadingData}
          />
        )}

        {tab === "audit" && (
          <AuditTab logs={logs} loading={loadingData} onClearLogs={clearLogs} />
        )}

        {tab === "submissions" && (
          <SubmissionsTab
            submissions={submissions}
            loading={loadingData}
            onDelete={deleteSubmission}
          />
        )}
      </div>
    </div>
  );
}

function DashboardTab({
  stats,
  loading,
}: {
  stats: Stats | null;
  loading: boolean;
}) {
  return (
    <div>
      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-label">total users</div>
          <div className="admin-metric-value">
            {stats?.metrics.totalUsers ?? (loading ? "..." : 0)}
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-label">total submissions</div>
          <div className="admin-metric-value">
            {stats?.metrics.totalSubmissions ?? (loading ? "..." : 0)}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-section-title">activity stream</div>
        <div className="admin-activity-list">
          {(stats?.activity ?? []).map((item, i) => (
            <div className="admin-activity-row" key={i}>
              <span>
                <span className="tag mr-2">{item.type}</span>
                {item.srn} — {item.action}
              </span>
              <span className="text-fg-faint">{formatToIST(item.created_at)}</span>
            </div>
          ))}
          {!loading && (stats?.activity ?? []).length === 0 && (
            <div className="admin-activity-row text-fg-faint">
              no activity yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsersTab({
  users,
  currentSrn,
  onToggleRole,
  loading,
}: {
  users: AdminUser[];
  currentSrn: string;
  onToggleRole: (srn: string) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.srn?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.branch?.toLowerCase().includes(q),
    );
  }, [users, query]);

  return (
    <div className="admin-card">
      <div className="admin-section-title flex items-center justify-between flex-wrap gap-3">
        <span>
          users ({filtered.length}
          {filtered.length !== users.length ? ` / ${users.length}` : ""})
        </span>
      </div>
      <div className="admin-sub-toolbar">
        <input
          type="text"
          placeholder="search srn, name, branch..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="admin-search"
        />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>srn</th>
              <th>name</th>
              <th>role</th>
              <th>branch</th>
              <th>sem</th>
              <th>last login</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.srn}>
                <td>{u.srn}</td>
                <td>{u.name}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      u.role === "admin" ? "admin-badge-admin" : ""
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td>{abbreviateBranch(u.branch)}</td>
                <td>{u.semester}</td>
                <td>{formatToIST(u.last_login)}</td>
                <td>
                  {u.srn === currentSrn ? (
                    <span className="text-fg-faint">you</span>
                  ) : (
                    <button
                      className={`admin-role-btn ${
                        u.role === "admin"
                          ? "admin-role-btn-demote"
                          : "admin-role-btn-promote"
                      }`}
                      onClick={() => onToggleRole(u.srn)}
                    >
                      {u.role === "admin" ? "demote" : "promote"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && users.length > 0 && (
              <tr>
                <td colSpan={7} className="text-fg-faint">
                  no users match your search
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={7} className="text-fg-faint">
                  no users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditTab({
  logs,
  loading,
  onClearLogs,
}: {
  logs: AuditLog[];
  loading: boolean;
  onClearLogs: () => void;
}) {
  return (
    <div className="admin-card">
      <div className="admin-section-title flex items-center justify-between">
        <span>audit logs ({logs.length})</span>
        <button
          className="admin-role-btn admin-role-btn-demote"
          onClick={onClearLogs}
          disabled={loading || logs.length === 0}
        >
          clear_logs
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>time</th>
              <th>srn</th>
              <th>type</th>
              <th>action</th>
              <th>detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{formatToIST(l.created_at)}</td>
                <td>{l.srn}</td>
                <td>
                  <span className="admin-badge">{l.user_type}</span>
                </td>
                <td>
                  <span
                    className={`admin-badge ${
                      l.action === "role_change" ? "admin-badge-warn" : ""
                    }`}
                  >
                    {l.action}
                  </span>
                </td>
                <td>{l.detail ?? "—"}</td>
              </tr>
            ))}
            {!loading && logs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-fg-faint">
                  no audit logs yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const BRANCH_ABBREVIATIONS: Record<string, string> = {
  "computer science and engineering": "CSE",
  "computer science and engineering (ai&ml)": "CSE (AI/ML)",
  "computer science and engineering (ai/ml)": "CSE (AI/ML)",
};

function abbreviateBranch(branch: string | undefined): string {
  if (!branch) return "";
  return BRANCH_ABBREVIATIONS[branch.trim().toLowerCase()] ?? branch;
}

const DOMAIN_LABELS: Record<string, string> = {
  tech: "tech",
  events: "events",
  marketing: "marketing",
  media: "media",
  design: "design",
};

const DOMAIN_ORDER = ["tech", "events", "marketing", "media", "design"];

const DOMAIN_FIELD_GROUPS: Record<
  string,
  { label: string; key: string }[]
> = {
  tech: [
    { label: "why tech?", key: "techWhyDomain" },
    { label: "prior experience", key: "techPriorExperience" },
    { label: "cyber experience", key: "techCyberExperience" },
    { label: "preferred language", key: "techLanguage" },
    { label: "ctf participated", key: "techCtfParticipated" },
    { label: "ctf (other)", key: "techCtfOther" },
    { label: "ctf confidence", key: "techCtfConfidence" },
    { label: "github", key: "techGithub" },
    { label: "linkedin", key: "techLinkedin" },
    { label: "project", key: "techProject" },
  ],
  events: [
    { label: "why events?", key: "eventsWhyJoin" },
    { label: "prior experience", key: "eventsPriorExperience" },
    { label: "plan steps", key: "eventsPlanSteps" },
    { label: "orientation ideas", key: "eventsOrientationIdeas" },
    { label: "what excites you", key: "eventsExcites" },
  ],
  marketing: [
    { label: "why marketing?", key: "marketingWhyDomain" },
    { label: "experience", key: "marketingExperience" },
    { label: "confidence (1-10)", key: "marketingConfidence" },
  ],
  media: [
    { label: "why media?", key: "mediaWhyDomain" },
    { label: "tools", key: "mediaTools" },
    { label: "portfolio", key: "mediaPortfolio" },
  ],
  design: [
    { label: "why design?", key: "designWhyDomain" },
    { label: "tools", key: "designTools" },
    { label: "confidence (1-10)", key: "designConfidence" },
  ],
};

function DetailField({ label, value }: { label: string; value: ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="admin-sub-field">
      <div className="admin-sub-field-label">{label}</div>
      <div className="admin-sub-field-value">{value}</div>
    </div>
  );
}

function SubmissionDetail({ s }: { s: Submission }) {
  const domains = s.domains ?? [];
  return (
    <div className="admin-sub-detail">
      <div className="admin-sub-detail-group">
        <div className="admin-sub-detail-heading">contact</div>
        <div className="admin-sub-field-grid">
          <DetailField label="email" value={s.email} />
          <DetailField label="phone" value={s.phone as string} />
          <DetailField
            label="portfolio"
            value={
              s.portfolioUrl ? (
                <a
                  href={s.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline"
                >
                  {s.portfolioUrl}
                </a>
              ) : null
            }
          />
        </div>
      </div>

      <DetailField label="general experience" value={s.experience} />
      <DetailField label="why join layer8?" value={s.whyJoin} />

      {domains.map((d) => {
        const fields = DOMAIN_FIELD_GROUPS[d];
        if (!fields) return null;
        const populated = fields.filter((f) => {
          const v = s[f.key];
          return v !== null && v !== undefined && v !== "";
        });
        if (populated.length === 0) return null;
        return (
          <div className="admin-sub-detail-group" key={d}>
            <div className="admin-sub-detail-heading">
              {DOMAIN_LABELS[d] ?? d}
            </div>
            <div className="admin-sub-field-grid">
              {populated.map((f) => (
                <DetailField
                  key={f.key}
                  label={f.label}
                  value={s[f.key] as string}
                />
              ))}
            </div>
          </div>
        );
      })}

      <DetailField label="feedback & queries" value={s.feedback} />
    </div>
  );
}

function SubmissionsTab({
  submissions,
  loading,
  onDelete,
}: {
  submissions: Submission[];
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of submissions) {
      for (const d of s.domains ?? []) {
        counts[d] = (counts[d] ?? 0) + 1;
      }
    }
    return counts;
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return submissions.filter((s) => {
      if (domainFilter !== "all" && !(s.domains ?? []).includes(domainFilter)) {
        return false;
      }
      if (!q) return true;
      return (
        s.fullName?.toLowerCase().includes(q) ||
        s.srn?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
      );
    });
  }, [submissions, query, domainFilter]);

  return (
    <div className="admin-card">
      <div className="admin-section-title flex items-center justify-between flex-wrap gap-3">
        <span>
          submissions ({filtered.length}
          {filtered.length !== submissions.length ? ` / ${submissions.length}` : ""})
        </span>
        <ExportControls />
      </div>

      <div className="admin-sub-toolbar">
        <input
          type="text"
          placeholder="search name, srn, email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="admin-search"
        />
        <div className="admin-filter-chips">
          <button
            className={`admin-filter-chip ${domainFilter === "all" ? "admin-filter-chip-active" : ""}`}
            onClick={() => setDomainFilter("all")}
          >
            all ({submissions.length})
          </button>
          {DOMAIN_ORDER.filter((d) => domainCounts[d]).map((d) => (
            <button
              key={d}
              className={`admin-filter-chip ${domainFilter === d ? "admin-filter-chip-active" : ""}`}
              onClick={() => setDomainFilter(d)}
            >
              {DOMAIN_LABELS[d]} ({domainCounts[d]})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-sub-list">
        {filtered.map((s) => {
          const isOpen = expandedId === s.id;
          return (
            <div className="admin-sub-row" key={s.id}>
              <div
                role="button"
                tabIndex={0}
                className="admin-sub-row-main"
                onClick={() => setExpandedId(isOpen ? null : s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedId(isOpen ? null : s.id);
                  }
                }}
                aria-expanded={isOpen}
              >
                <span className="admin-sub-chevron">{isOpen ? "▾" : "▸"}</span>
                <span className="admin-sub-name">
                  <span className="admin-sub-fullname">{s.fullName}</span>
                  <span className="admin-sub-srn">{s.srn}</span>
                </span>
                <span className="admin-sub-tags">
                  {(s.domains ?? []).map((d) => (
                    <span className="tag" key={d}>
                      {DOMAIN_LABELS[d] ?? d}
                    </span>
                  ))}
                </span>
                <span className="admin-sub-meta">
                  {abbreviateBranch(s.branch)} · yr {s.year}
                </span>
                <span className="admin-sub-date">{formatToIST(s.createdAt)}</span>
                <button
                  type="button"
                  className="admin-role-btn admin-role-btn-demote admin-sub-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s.id);
                  }}
                >
                  delete
                </button>
              </div>
              {isOpen && <SubmissionDetail s={s} />}
            </div>
          );
        })}

        {!loading && filtered.length === 0 && submissions.length > 0 && (
          <div className="admin-sub-empty">no submissions match your search/filter</div>
        )}
        {!loading && submissions.length === 0 && (
          <div className="admin-sub-empty">no submissions yet</div>
        )}
      </div>
    </div>
  );
}