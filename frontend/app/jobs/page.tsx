"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";

import { Job, Category } from "@/types";
import {
  getJobs,
  getCategories,
} from "@/lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [jobsData, categoriesData] =
          await Promise.all([
            getJobs(),
            getCategories(),
          ]);

        console.log("Jobs:", jobsData);
        console.log("Categories:", categoriesData);

        const jobsArray = Array.isArray(jobsData)
          ? jobsData
          : jobsData.jobs || [];

        const categoriesArray =
          Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.categories || [];

        setJobs(jobsArray);
        setCategories(categoriesArray);
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load jobs. Make sure backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // SEARCH + CATEGORY FILTER
  const filteredJobs = jobs.filter((job) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      searchText === "" ||
      job.title
        ?.toLowerCase()
        .includes(searchText) ||
      job.description
        ?.toLowerCase()
        .includes(searchText) ||
      job.location
        ?.toLowerCase()
        .includes(searchText) ||
      job.company?.name
        ?.toLowerCase()
        .includes(searchText) ||
      job.category?.name
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      selectedCategory === "" ||
      job.categoryId === selectedCategory ||
      job.category?._id === selectedCategory;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  return (
    <>
      <Navbar />

      <main className="jobs-page">

        {/* HEADER */}

        <section className="jobs-page-header">

          <span className="section-label">
            NEXORA JOB MARKETPLACE
          </span>

          <h1>
            Explore your next
            <span> opportunity.</span>
          </h1>

          <p>
            Discover jobs from companies looking
            for ambitious people like you.
          </p>

          <SearchBar
            onSearch={(value) =>
              setSearch(value)
            }
          />

        </section>


        {/* JOBS AREA */}

        <section className="jobs-page-content">

          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />

          {search && (
            <div className="search-result-text">
              Searching for:
              <strong> {search}</strong>
            </div>
          )}

          {loading && (
            <div className="loading-box">

              <div className="loader"></div>

              <p>
                Loading jobs...
              </p>

            </div>
          )}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            filteredJobs.length > 0 && (

              <div className="jobs-grid">

                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                  />
                ))}

              </div>
            )}

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

      </main>

      <Footer />
    </>
  );
}