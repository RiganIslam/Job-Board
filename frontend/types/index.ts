export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Company {
  _id: string;
  name: string;
  logo?: string;
  website?: string;
  description?: string;
  location?: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  featured: boolean;
  createdAt: string;

  companyId: string;
  categoryId: string;

  company?: Company;
  category?: Category;
}

export interface Application {
  _id: string;
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  coverLetter?: string;
  status: string;
  createdAt: string;
}

export interface Stats {
  jobs: number;
  companies: number;
  categories: number;
  applications: number;
  featuredJobs: number;
}