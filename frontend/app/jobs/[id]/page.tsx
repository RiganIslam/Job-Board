"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Job } from "@/types";
import { getJob } from "@/lib/api";

export default function JobDetailsPage() {
  const params = useParams();

  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);

        const data = await getJob(id);

        console.log("Job Details:", data);

        if (data.job) {
          setJob(data.job);
        } else {
          setJob(data);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load job details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadJob();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="details-page">

          <div className="loading-box">
            <div className="loader"></div>

            <p>
              Loading job...
            </p>
          </div>

        </main>

        <Footer />
      </>
    );
  }

  if (error || !job) {
    return (
      <>
        <Navbar />

        <main className="details-page">

          <div className="error-box">
            {error || "Job not found."}
          </div>

        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="details-page">

        {/* BACK */}

        <Link
          href="/jobs"
          className="back-link"
        >
          ← Back to Jobs
        </Link>


        {/* JOB HEADER */}

        <section className="job-details-card">

          <div className="details-company">

            <div className="details-logo">
              {job.company?.name
                ?.charAt(0) || "N"}
            </div>

            <div>
              <h3>
                {job.company?.name ||
                  "Company"}
              </h3>

              <p>
                {job.location}
              </p>
            </div>

          </div>


          {job.featured && (
            <div className="featured-badge">
              ✦ Featured
            </div>
          )}


          <h1>
            {job.title}
          </h1>

          <div className="details-tags">

            <span>
              {job.type}
            </span>

            <span>
              {job.experience}
            </span>

            <span>
              {job.category?.name ||
                "General"}
            </span>

            <span>
              {job.location}
            </span>

          </div>

        </section>


        {/* CONTENT */}

        <div className="details-layout">

          {/* DESCRIPTION */}

          <section className="details-main">

            <div className="details-section">

              <h2>
                About this role
              </h2>

              <p className="full-description">
                {job.description}
              </p>

            </div>


            <div className="details-section">

              <h2>
                Job Information
              </h2>

              <div className="info-grid">

                <div>
                  <span>
                    Job Type
                  </span>

                  <strong>
                    {job.type}
                  </strong>
                </div>

                <div>
                  <span>
                    Experience
                  </span>

                  <strong>
                    {job.experience}
                  </strong>
                </div>

                <div>
                  <span>
                    Location
                  </span>

                  <strong>
                    {job.location}
                  </strong>
                </div>

                <div>
                  <span>
                    Salary
                  </span>

                  <strong>
                    {job.salary}
                  </strong>
                </div>

              </div>

            </div>

          </section>


          {/* SIDEBAR */}

          <aside className="details-sidebar">

            <div className="apply-card">

              <span>
                COMPENSATION
              </span>

              <h2>
                {job.salary}
              </h2>

              <p>
                Apply now and take the next
                step in your career.
              </p>

              <Link
                href={`/jobs/${job._id}/apply`}
                className="apply-button"
              >
                Apply for this job →
              </Link>

            </div>


            <div className="company-card">

              <span>
                COMPANY
              </span>

              <h3>
                {job.company?.name ||
                  "Company"}
              </h3>

              {job.company?.description && (
                <p>
                  {job.company.description}
                </p>
              )}

              {job.company?.location && (
                <div>
                  📍 {job.company.location}
                </div>
              )}

            </div>

          </aside>

        </div>

      </main>

      <Footer />
    </>
  );
}