"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link href="/" className="logo">
          NEXORA<span>.</span>
        </Link>

        <div className={`nav-links ${open ? "mobile-open" : ""}`}>
          <Link href="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          <Link href="/jobs" onClick={() => setOpen(false)}>
            Find Jobs
          </Link>

          <Link href="/create-job" onClick={() => setOpen(false)}>
            Post a Job
          </Link>

          <Link href="/applications" onClick={() => setOpen(false)}>
            Applications
          </Link>
        </div>

        <div className="nav-actions">
          <Link href="/create-job" className="nav-button">
            Post a Job
          </Link>

          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

      </div>
    </nav>
  );
}