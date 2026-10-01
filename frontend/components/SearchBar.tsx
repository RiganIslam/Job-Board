"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({
  onSearch,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    onSearch(value);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const newValue = e.target.value;

    setValue(newValue);

    // Search while typing
    onSearch(newValue);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="search-box"
    >
      <div className="search-input-wrapper">
        <span className="search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search jobs, skills, companies..."
          value={value}
          onChange={handleChange}
        />
      </div>

      <button type="submit">
        Search Jobs
      </button>
    </form>
  );
}