"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Application, Job } from "@/types";

const API_URL = "http://localhost:5000/api";

interface ApplicationWithJob extends Application {
  job?: Job;
}

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<ApplicationWithJob[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/applications`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      console.log(
        "APPLICATIONS RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to load applications."
        );
      }

      const applicationList =
        Array.isArray(data)
          ? data
          : data.applications || [];

      setApplications(applicationList);
    } catch (error) {
      console.error(
        "APPLICATION LOAD ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  }

  function getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "status-accepted";

      case "rejected":
        return "status-rejected";

      case "shortlisted":
        return "status-shortlisted";

      case "reviewing":
        return "status-reviewing";

      default:
        return "status-pending";
    }
  }

  return (
    <>
      <Navbar />

      <main className="applications-page">

        {/* HEADER */}

        <section className="applications-header">

          <span className="section-label">
            APPLICATION CENTER
          </span>

          <h1>
            Your
            <span> applications.</span>
          </h1>

          <p>
            Track the applications you have
            submitted and follow their progress.
          </p>

        </section>

        {/* CONTENT */}

        <section className="applications-content">

          {/* STATS */}

          <div className="application-stats">

            <div className="application-stat">
              <span>Total Applications</span>

              <strong>
                {applications.length}
              </strong>
            </div>

            <div className="application-stat">
              <span>Pending</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status
                        ?.toLowerCase() ===
                      "pending"
                  ).length
                }
              </strong>
            </div>

            <div className="application-stat">
              <span>Reviewing</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status
                        ?.toLowerCase() ===
                      "reviewing"
                  ).length
                }
              </strong>
            </div>

            <div className="application-stat">
              <span>Accepted</span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status
                        ?.toLowerCase() ===
                      "accepted"
                  ).length
                }
              </strong>
            </div>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="loading-box">
              <div className="loader"></div>

              <p>
                Loading applications...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="error-box">
              <h3>
                Unable to load applications
              </h3>

              <p>{error}</p>

              <button
                className="retry-button"
                onClick={loadApplications}
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            applications.length === 0 && (
              <div className="applications-empty">

                <div className="empty-icon">
                  ◌
                </div>

                <h2>
                  No applications yet
                </h2>

                <p>
                  You haven't submitted any
                  applications yet.
                </p>

                <a
                  href="/jobs"
                  className="browse-jobs-button"
                >
                  Browse Jobs →
                </a>

              </div>
            )}

          {/* APPLICATION LIST */}

          {!loading &&
            !error &&
            applications.length > 0 && (
              <div className="applications-list">

                {applications.map(
                  (application) => (
                    <article
                      key={
                        application._id
                      }
                      className="application-card"
                    >

                      <div className="application-card-top">

                        <div className="application-avatar">
                          {application.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>

                        <div className="application-person">

                          <h2>
                            {application.name}
                          </h2>

                          <p>
                            {application.email}
                          </p>

                        </div>

                        <span
                          className={`application-status ${getStatusClass(
                            application.status
                          )}`}
                        >
                          {application.status ||
                            "Pending"}
                        </span>

                      </div>

                      <div className="application-divider"></div>

                      <div className="application-details">

                        <div>
                          <span>
                            Job ID
                          </span>

                          <strong>
                            {application.jobId}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Phone
                          </span>

                          <strong>
                            {application.phone ||
                              "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Applied
                          </span>

                          <strong>
                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : "Recently"}
                          </strong>
                        </div>

                      </div>

                      {application.coverLetter && (
                        <div className="application-cover-letter">

                          <span>
                            Cover Letter
                          </span>

                          <p>
                            {
                              application.coverLetter
                            }
                          </p>

                        </div>
                      )}

                      {application.resume && (
                        <a
                          href={
                            application.resume
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resume-button"
                        >
                          View Resume ↗
                        </a>
                      )}

                    </article>
                  )
                )}

              </div>
            )}

        </section>

      </main>

      <Footer />
    </>
  );
}