import Link from "next/link";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="job-card">

      {job.featured && (
        <div className="featured-badge">
          ✦ Featured
        </div>
      )}

      <div className="company-row">

        <div className="company-logo">
          {job.company?.name?.charAt(0) || "N"}
        </div>

        <div>
          <h4>
            {job.company?.name || "Company"}
          </h4>

          <span>
            {job.location}
          </span>
        </div>

      </div>

      <h3 className="job-title">
        {job.title}
      </h3>

      <p className="job-description">
        {job.description?.slice(0, 110)}
        {job.description?.length > 110 ? "..." : ""}
      </p>

      <div className="job-tags">

        <span>
          {job.type}
        </span>

        <span>
          {job.experience}
        </span>

        <span>
          {job.category?.name || "General"}
        </span>

      </div>

      <div className="job-bottom">

        <div className="salary">
          {job.salary}
        </div>

        <Link
          href={`/jobs/${job._id}`}
          className="view-job"
        >
          View Job →
        </Link>

      </div>

    </div>
  );
}