"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Category, Company } from "@/types";

const API_URL = "http://localhost:5000/api";

export default function CreateJobPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "Full-time",
    experience: "Entry Level",
    categoryId: "",
    companyId: "",
    featured: false,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesResponse, companiesResponse] =
          await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/companies`),
          ]);

        if (!categoriesResponse.ok) {
          throw new Error("Failed to load categories");
        }

        if (!companiesResponse.ok) {
          throw new Error("Failed to load companies");
        }

        const categoriesData =
          await categoriesResponse.json();

        const companiesData =
          await companiesResponse.json();

        const categoryList = Array.isArray(categoriesData)
          ? categoriesData
          : categoriesData.categories || [];

        const companyList = Array.isArray(companiesData)
          ? companiesData
          : companiesData.companies || [];

        setCategories(categoryList);
        setCompanies(companyList);

        if (categoryList.length > 0) {
          setForm((previous) => ({
            ...previous,
            categoryId: categoryList[0]._id,
          }));
        }

        if (companyList.length > 0) {
          setForm((previous) => ({
            ...previous,
            companyId: companyList[0]._id,
          }));
        }
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load categories and companies."
        );
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCheckboxChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((previous) => ({
      ...previous,
      featured: e.target.checked,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Please enter a job title.");
      return;
    }

    if (!form.description.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter the job location.");
      return;
    }

    if (!form.salary.trim()) {
      setError("Please enter the salary.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!form.companyId) {
      setError("Please select a company.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create job."
        );
      }

      setSuccess("Job created successfully! 🎉");

      const createdJob = data.job || data;

      setTimeout(() => {
        if (createdJob?._id) {
          router.push(`/jobs/${createdJob._id}`);
        } else {
          router.push("/jobs");
        }
      }, 1000);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create job."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <>
        <Navbar />

        <main className="create-job-page">
          <div className="loading-box">
            <div className="loader"></div>
            <p>Loading form...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="create-job-page">
        <section className="create-job-header">
          <span className="section-label">
            FOR EMPLOYERS
          </span>

          <h1>
            Create your next
            <span> opportunity.</span>
          </h1>

          <p>
            Publish a job and connect with talented
            professionals.
          </p>
        </section>

        <section className="create-job-card">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>
                <div>
                  <h2>Job Information</h2>
                  <p>
                    Tell candidates about the position.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">
                  Job Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Job Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={7}
                  placeholder="Describe the role, responsibilities and requirements..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="salary">
                    Salary
                  </label>

                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    placeholder="e.g. $70k - $100k"
                    value={form.salary}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="type">
                    Job Type
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Remote">
                      Remote
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">
                    Experience
                  </label>

                  <select
                    id="experience"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  >
                    <option value="Entry Level">
                      Entry Level
                    </option>

                    <option value="Mid Level">
                      Mid Level
                    </option>

                    <option value="Senior Level">
                      Senior Level
                    </option>

                    <option value="Lead">
                      Lead
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>

                <div>
                  <h2>Company & Category</h2>

                  <p>
                    Connect this job with a company
                    and category.
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="companyId">
                    Company
                  </label>

                  <select
                    id="companyId"
                    name="companyId"
                    value={form.companyId}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select company
                    </option>

                    {companies.map((company) => (
                      <option
                        key={company._id}
                        value={company._id}
                      >
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="categoryId">
                    Category
                  </label>

                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="featured-checkbox">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleCheckboxChange}
                />

                <span>
                  Mark this job as Featured
                </span>
              </label>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="form-success">
                {success}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => router.push("/jobs")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-job-button"
                disabled={submitting}
              >
                {submitting
                  ? "Publishing..."
                  : "Publish Job →"}
              </button>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}