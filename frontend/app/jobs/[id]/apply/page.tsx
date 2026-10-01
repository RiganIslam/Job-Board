"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Job } from "@/types";

const API_URL = "http://localhost:5000/api";

export default function ApplyJobPage() {
  const params = useParams();

  const id = params.id as string;

  const [job, setJob] = useState<Job | null>(null);

  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });

  // =========================================
  // LOAD JOB
  // =========================================

  useEffect(() => {
    async function loadJob() {
      try {
        setLoadingJob(true);
        setPageError("");

        const response = await fetch(
          `${API_URL}/jobs/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log("JOB RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              data.error ||
              "Failed to load job."
          );
        }

        const jobData = data.job || data;

        setJob(jobData);
      } catch (error) {
        console.error("JOB LOAD ERROR:", error);

        setPageError(
          error instanceof Error
            ? error.message
            : "Failed to load job."
        );
      } finally {
        setLoadingJob(false);
      }
    }

    if (id) {
      loadJob();
    }
  }, [id]);

  // =========================================
  // INPUT CHANGE
  // =========================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setSuccess("");
  }

  // =========================================
  // FORM SUBMIT
  // =========================================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setFormError("");
    setSuccess("");

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!form.name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setFormError("Please enter your email.");
      return;
    }

    if (!form.email.includes("@")) {
      setFormError(
        "Please enter a valid email address."
      );
      return;
    }

    if (!form.phone.trim()) {
      setFormError(
        "Please enter your phone number."
      );
      return;
    }

    if (!form.resume.trim()) {
      setFormError(
        "Please enter your resume link."
      );
      return;
    }

    if (!form.coverLetter.trim()) {
      setFormError(
        "Please write a cover letter."
      );
      return;
    }

    try {
      setSubmitting(true);

      // -------------------------
      // APPLICATION DATA
      // -------------------------

      const applicationData = {
        jobId: id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        resume: form.resume.trim(),
        coverLetter: form.coverLetter.trim(),
      };

      console.log(
        "SENDING APPLICATION:",
        applicationData
      );

      // -------------------------
      // SEND TO BACKEND
      // -------------------------

      const response = await fetch(
        `${API_URL}/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            applicationData
          ),
        }
      );

      // -------------------------
      // READ RESPONSE
      // -------------------------

      const data = await response.json();

      console.log(
        "APPLICATION RESPONSE:",
        data
      );

      // -------------------------
      // SERVER ERROR
      // -------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Server error: ${response.status}`
        );
      }

      // -------------------------
      // SUCCESS
      // -------------------------

      setSuccess(
        "Application submitted successfully! 🎉"
      );

      // Clear form

      setForm({
        name: "",
        email: "",
        phone: "",
        resume: "",
        coverLetter: "",
      });
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error
      );

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================
  // LOADING
  // =========================================

  if (loadingJob) {
    return (
      <>
        <Navbar />

        <main className="apply-page">
          <div className="loading-box">
            <div className="loader"></div>

            <p>
              Loading job information...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================
  // JOB LOAD ERROR
  // =========================================

  if (pageError || !job) {
    return (
      <>
        <Navbar />

        <main className="apply-page">
          <div className="error-box">
            <h3>
              Unable to load job
            </h3>

            <p>
              {pageError ||
                "Job not found."}
            </p>

            <Link
              href="/jobs"
              className="back-link"
            >
              ← Back to Jobs
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <>
      <Navbar />

      <main className="apply-page">

        <div className="apply-container">

          {/* BACK */}

          <Link
            href={`/jobs/${id}`}
            className="back-link"
          >
            ← Back to Job
          </Link>

          {/* HEADER */}

          <section className="apply-header">

            <span className="section-label">
              JOB APPLICATION
            </span>

            <h1>
              Apply for
              <span>
                {" "}
                {job.title}
              </span>
            </h1>

            <p>
              Submit your application and
              take the next step in your
              career.
            </p>

          </section>

          {/* CONTENT */}

          <div className="apply-layout">

            {/* =========================
                JOB SUMMARY
            ========================== */}

            <aside className="apply-job-summary">

              <div className="summary-logo">
                {job.company?.name
                  ?.charAt(0)
                  .toUpperCase() || "N"}
              </div>

              <h2>
                {job.title}
              </h2>

              <p className="summary-company">
                {job.company?.name ||
                  "Company"}
              </p>

              <div className="summary-info">

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
                    Salary
                  </span>

                  <strong>
                    {job.salary}
                  </strong>
                </div>

                <div>
                  <span>
                    Category
                  </span>

                  <strong>
                    {job.category?.name ||
                      "General"}
                  </strong>
                </div>

              </div>

            </aside>

            {/* =========================
                APPLICATION FORM
            ========================== */}

            <section className="application-form-card">

              <div className="application-form-title">

                <h2>
                  Your Application
                </h2>

                <p>
                  Please provide accurate
                  information.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
              >

                {/* NAME + EMAIL */}

                <div className="form-grid">

                  <div className="form-group">

                    <label htmlFor="name">
                      Full Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label htmlFor="email">
                      Email Address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    value={form.phone}
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* RESUME */}

                <div className="form-group">

                  <label htmlFor="resume">
                    Resume Link *
                  </label>

                  <input
                    id="resume"
                    name="resume"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={form.resume}
                    onChange={
                      handleChange
                    }
                  />

                  <small>
                    Add a shareable link to
                    your resume.
                  </small>

                </div>

                {/* COVER LETTER */}

                <div className="form-group">

                  <label htmlFor="coverLetter">
                    Cover Letter *
                  </label>

                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={8}
                    placeholder="Tell the company why you are a good fit for this role..."
                    value={
                      form.coverLetter
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* ERROR */}

                {formError && (
                  <div className="form-error">
                    ⚠ {formError}
                  </div>
                )}

                {/* SUCCESS */}

                {success && (
                  <div className="form-success">
                    ✓ {success}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="submit-application-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application →"}
                </button>

              </form>

            </section>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}