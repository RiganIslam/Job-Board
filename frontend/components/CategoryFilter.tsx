"use client";

import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onChange: (value: string) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <button
        type="button"
        className={selected === "" ? "active" : ""}
        onClick={() => onChange("")}
      >
        All Jobs
      </button>

      {categories.map((category) => (
        <button
          type="button"
          key={category._id}
          className={
            selected === category._id
              ? "active"
              : ""
          }
          onClick={() =>
            onChange(category._id)
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}