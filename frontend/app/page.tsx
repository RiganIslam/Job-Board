"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";

import { Job, Category, Stats } from "@/types";
import {
  getJobs,
  getCategories,
  getStats,
} from "@/lib/api";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [jobsData, categoriesData, statsData] =
          await Promise.all([
            getJobs(),
            getCategories(),
            getStats(),
          ]);

        console.log("JOBS:", jobsData);
        console.log("CATEGORIES:", categoriesData);
        console.log("STATS:", statsData);

        // Jobs
        if (Array.isArray(jobsData)) {
          setJobs(jobsData);
        } else {
          setJobs(jobsData.jobs || []);
        }

        // Categories
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setCategories(categoriesData.categories || []);
        }

        // Stats
        if (statsData.stats) {
          setStats(statsData.stats);
        } else {
          setStats(statsData);
        }
      } catch (error) {
        console.error("LOAD ERROR:", error);

        setError(
          "Could not connect to the backend. Make sure your backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =========================
  // SEARCH
  // =========================

  function handleSearch(value: string) {
    setSearch(value);
  }

  // =========================
  // CATEGORY
  // =========================

  function handleCategory(value: string) {
    setSelectedCategory(value);
  }

  // =========================
  // FRONTEND FILTER
  // =========================

  const filteredJobs = jobs.filter((job) => {
    // Search
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      searchText === "" ||
      job.title?.toLowerCase().includes(searchText) ||
      job.description?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText) ||
      job.company?.name?.toLowerCase().includes(searchText) ||
      job.category?.name?.toLowerCase().includes(searchText);

    // Category
    const matchesCategory =
      selectedCategory === "" ||
      job.categoryId === selectedCategory ||
      job.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main>
      <Navbar />

      {/* =========================
          HERO
      ========================= */}

      <section className="hero">
        <div className="hero-glow glow-one"></div>
        <div className="hero-glow glow-two"></div>

        <div className="hero-content">
          <div className="hero-badge">
            ✦ THE FUTURE OF CAREERS
          </div>

          <h1>
            Find work that
            <br />
            <span>moves you forward.</span>
          </h1>

          <p>
            Discover exceptional opportunities from
            innovative companies and build the career
            you actually want.
          </p>

          <SearchBar onSearch={handleSearch} />

          <div className="hero-trust">
            <span>
              Discover your next opportunity
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          STATS
      ========================= */}

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{stats?.jobs ?? jobs.length}</strong>
            <span>Open Positions</span>
          </div>

          <div className="stat-card">
            <strong>{stats?.companies ?? 0}</strong>
            <span>Companies</span>
          </div>

          <div className="stat-card">
            <strong>
              {stats?.categories ?? categories.length}
            </strong>
            <span>Career Categories</span>
          </div>

          <div className="stat-card">
            <strong>{stats?.applications ?? 0}</strong>
            <span>Applications</span>
          </div>
        </div>
      </section>

      {/* =========================
          JOB SECTION
      ========================= */}

      <section className="jobs-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              EXPLORE OPPORTUNITIES
            </span>

            <h2>
              Find your next
              <span> opportunity.</span>
            </h2>
          </div>

          <p>
            Search and explore opportunities from
            companies building the future.
          </p>
        </div>

        {/* SEARCH RESULT */}

        {search && (
          <div className="search-result-text">
            Searching for:{" "}
            <strong>{search}</strong>
          </div>
        )}

        {/* CATEGORY */}

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={handleCategory}
        />

        {/* ERROR */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="loading-box">
            <div className="loader"></div>

            <p>
              Loading jobs...
            </p>
          </div>
        )}

        {/* JOBS */}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
              />
            ))}
          </div>
        )}

        {/* NO RESULT */}

        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="empty-box">
              <div>⌕</div>

              <h3>
                No jobs found
              </h3>

              <p>
                Try another search or category.
              </p>

              <button
                className="clear-filter-button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">
        <div className="cta-content">
          <span>FOR EMPLOYERS</span>

          <h2>
            Find the people who
            <br />
            will build your future.
          </h2>

          <p>
            Reach ambitious professionals and
            discover your next great hire.
          </p>

          <a
            href="/create-job"
            className="cta-button"
          >
            Post a Job →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}