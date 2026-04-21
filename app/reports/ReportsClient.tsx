"use client";

import { useState, useEffect, useCallback } from "react";

import Navbar from "@/components/Navbar";
import ReportCard from "@/components/ReportCard";
import { Report, ReportsResponse, UserRole } from "@/types";

import styles from "./reports.module.scss";

interface ReportsClientProps {
  userName: string;
  userRole: UserRole;
}

const SORT_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "category", label: "Category" },
  { value: "createdAt", label: "Date Created" },
  { value: "updatedAt", label: "Last Updated" },
];

export default function ReportsClient({
  userName,
  userRole,
}: ReportsClientProps) {
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search,
        sort,
        order,
      });

      const res = await fetch(`/api/reports?${params}`);

      if (!res.ok) throw new Error("Failed to fetch reports");

      const json: ReportsResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [search, sort, order]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className={styles.root}>
      <Navbar userName={userName} userRole={userRole} />

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <div>
            <h1 className={styles.pageTitle}>Reports</h1>
            <p className={styles.pageSubtitle}>{data ? `` : "Loading…"}</p>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search</label>
            <div className={styles.searchWrapper}>
              <svg
                className={styles.searchIcon}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Title, author, tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Sort by</label>
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Order</label>
            <div className={styles.orderButtons}>
              <button
                className={`${styles.orderBtn} ${order === "asc" ? styles.orderActive : ""}`}
                onClick={() => setOrder("asc")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
                Ascending
              </button>
              <button
                className={`${styles.orderBtn} ${order === "desc" ? styles.orderActive : ""}`}
                onClick={() => setOrder("desc")}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                Descending
              </button>
            </div>
          </div>

          {search && (
            <button
              className={styles.clearFilters}
              onClick={() => {
                setSearch("");
              }}
            >
              Clear all filters
            </button>
          )}
        </aside>

        <section className={styles.content}>
          {loading && (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className={styles.errorState}>
              <span>⚠</span>
              <p>{error}</p>
              <button onClick={fetchReports}>Try again</button>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {data.data.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>◎</div>
                  <h3>No reports found</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  {data.data.map((report: Report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
