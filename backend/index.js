const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "nexora_job_board";

app.use(cors());
app.use(express.json());

let db;
let jobs;
let categories;
let companies;
let applications;

/* =========================================
   MONGODB CONNECTION
========================================= */

const client = new MongoClient(MONGODB_URI);

async function connectDatabase() {
  try {
    await client.connect();

    db = client.db(DB_NAME);

    jobs = db.collection("jobs");
    categories = db.collection("categories");
    companies = db.collection("companies");
    applications = db.collection("applications");

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

/* =========================================
   ROOT
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NEXORA Job Board API is running 🚀",
  });
});

/* =========================================
   CATEGORY ROUTES
========================================= */

// GET all categories

app.get("/api/categories", async (req, res) => {
  try {
    const result = await categories
      .find({})
      .sort({ name: 1 })
      .toArray();

    res.json({
      success: true,
      categories: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load categories",
    });
  }
});

// GET single category

app.get("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await categories.findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load category",
    });
  }
});

// CREATE category

app.post("/api/categories", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await categories.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = {
      name: name.trim(),
      description: description?.trim() || "",
      createdAt: new Date(),
    };

    const result = await categories.insertOne(category);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: {
        _id: result.insertedId,
        ...category,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
});

// DELETE category

app.delete("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryId = new ObjectId(id);

    const category = await categories.findOne({
      _id: categoryId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const usedByJobs = await jobs.countDocuments({
      categoryId,
    });

    if (usedByJobs > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this category because ${usedByJobs} job(s) use it`,
      });
    }

    await categories.deleteOne({
      _id: categoryId,
    });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
});

/* =========================================
   COMPANY ROUTES
========================================= */

// GET all companies

app.get("/api/companies", async (req, res) => {
  try {
    const result = await companies
      .find({})
      .sort({ name: 1 })
      .toArray();

    res.json({
      success: true,
      companies: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load companies",
    });
  }
});

// GET single company

app.get("/api/companies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    const company = await companies.findOne({
      _id: new ObjectId(id),
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load company",
    });
  }
});

// CREATE company

app.post("/api/companies", async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      website,
      location,
      industry,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = {
      name: name.trim(),
      logo: logo?.trim() || "",
      description: description?.trim() || "",
      website: website?.trim() || "",
      location: location?.trim() || "",
      industry: industry?.trim() || "",
      createdAt: new Date(),
    };

    const result = await companies.insertOne(company);

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: {
        _id: result.insertedId,
        ...company,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create company",
    });
  }
});

/* =========================================
   JOB ROUTES
========================================= */

// GET all jobs
// Search + category filter

app.get("/api/jobs", async (req, res) => {
  try {
    const { search, category, type, location } = req.query;

    const pipeline = [];

    const match = {};

    /* SEARCH */

    if (search && search.trim()) {
      match.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          companyName: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    /* JOB TYPE */

    if (type && type !== "all") {
      match.type = type;
    }

    /* LOCATION */

    if (location && location.trim()) {
      match.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    if (Object.keys(match).length > 0) {
      pipeline.push({
        $match: match,
      });
    }

    /* CATEGORY RELATIONSHIP */

    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    });

    /* COMPANY RELATIONSHIP */

    pipeline.push({
      $lookup: {
        from: "companies",
        localField: "companyId",
        foreignField: "_id",
        as: "company",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    });

    /* CATEGORY FILTER */

    if (category && category !== "all") {
      pipeline.push({
        $match: {
          "category._id": new ObjectId(category),
        },
      });
    }

    /* SORT */

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    const result = await jobs.aggregate(pipeline).toArray();

    res.json({
      success: true,
      count: result.length,
      jobs: result,
    });
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load jobs",
    });
  }
});

/* =========================================
   GET SINGLE JOB
========================================= */

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const pipeline = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "companies",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },

      {
        $unwind: {
          path: "$company",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const result = await jobs.aggregate(pipeline).toArray();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job: result[0],
    });
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load job",
    });
  }
});

/* =========================================
   CREATE JOB
========================================= */

app.post("/api/jobs", async (req, res) => {
  try {
    const {
      title,
      companyId,
      categoryId,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      responsibilities,
      skills,
      deadline,
      featured,
    } = req.body;

    /* REQUIRED VALIDATION */

    if (
      !title ||
      !companyId ||
      !categoryId ||
      !location ||
      !type ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, company, category, location, type and description are required",
      });
    }

    if (
      !ObjectId.isValid(companyId) ||
      !ObjectId.isValid(categoryId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company or category ID",
      });
    }

    /* CHECK COMPANY */

    const company = await companies.findOne({
      _id: new ObjectId(companyId),
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Selected company does not exist",
      });
    }

    /* CHECK CATEGORY */

    const category = await categories.findOne({
      _id: new ObjectId(categoryId),
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist",
      });
    }

    const job = {
      title: title.trim(),

      companyId: new ObjectId(companyId),

      categoryId: new ObjectId(categoryId),

      companyName: company.name,

      categoryName: category.name,

      location: location.trim(),

      type,

      salary: salary?.trim() || "Negotiable",

      experience: experience?.trim() || "Not specified",

      description: description.trim(),

      requirements: Array.isArray(requirements)
        ? requirements
        : [],

      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : [],

      skills: Array.isArray(skills)
        ? skills
        : [],

      deadline: deadline
        ? new Date(deadline)
        : null,

      featured: Boolean(featured),

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    const result = await jobs.insertOne(job);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: {
        _id: result.insertedId,
        ...job,
      },
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
});

/* =========================================
   UPDATE JOB
========================================= */

app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const existingJob = await jobs.findOne({
      _id: new ObjectId(id),
    });

    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {
      title,
      companyId,
      categoryId,
      location,
      type,
      salary,
      experience,
      description,
      requirements,
      responsibilities,
      skills,
      deadline,
      featured,
    } = req.body;

    if (
      !title ||
      !companyId ||
      !categoryId ||
      !location ||
      !type ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (
      !ObjectId.isValid(companyId) ||
      !ObjectId.isValid(categoryId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid company or category ID",
      });
    }

    const company = await companies.findOne({
      _id: new ObjectId(companyId),
    });

    const category = await categories.findOne({
      _id: new ObjectId(categoryId),
    });

    if (!company || !category) {
      return res.status(400).json({
        success: false,
        message: "Company or category not found",
      });
    }

    const updatedJob = {
      title: title.trim(),

      companyId: new ObjectId(companyId),

      categoryId: new ObjectId(categoryId),

      companyName: company.name,

      categoryName: category.name,

      location: location.trim(),

      type,

      salary: salary?.trim() || "Negotiable",

      experience: experience?.trim() || "Not specified",

      description: description.trim(),

      requirements: Array.isArray(requirements)
        ? requirements
        : [],

      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : [],

      skills: Array.isArray(skills)
        ? skills
        : [],

      deadline: deadline
        ? new Date(deadline)
        : null,

      featured: Boolean(featured),

      updatedAt: new Date(),
    };

    await jobs.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updatedJob,
      }
    );

    res.json({
      success: true,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job",
    });
  }
});

/* =========================================
   DELETE JOB
========================================= */

app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const jobId = new ObjectId(id);

    const job = await jobs.findOne({
      _id: jobId,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await jobs.deleteOne({
      _id: jobId,
    });

    /* Remove applications belonging to deleted job */

    await applications.deleteMany({
      jobId,
    });

    res.json({
      success: true,
      message: "Job and related applications deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job",
    });
  }
});

/* =========================================
   APPLICATION ROUTES
========================================= */

// GET all applications

app.get("/api/applications", async (req, res) => {
  try {
    const { jobId } = req.query;

    const match = {};

    if (jobId) {
      if (!ObjectId.isValid(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID",
        });
      }

      match.jobId = new ObjectId(jobId);
    }

    const pipeline = [
      {
        $match: match,
      },

      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },

      {
        $unwind: {
          path: "$job",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },
    ];

    const result = await applications
      .aggregate(pipeline)
      .toArray();

    res.json({
      success: true,
      count: result.length,
      applications: result,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load applications",
    });
  }
});

/* =========================================
   APPLY FOR JOB
========================================= */

app.post("/api/applications", async (req, res) => {
  try {
    const {
      jobId,
      name,
      email,
      phone,
      resume,
      coverLetter,
    } = req.body;

    if (
      !jobId ||
      !name ||
      !email ||
      !resume ||
      !coverLetter
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job, name, email, resume and cover letter are required",
      });
    }

    if (!ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await jobs.findOne({
      _id: new ObjectId(jobId),
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    /* Prevent duplicate application */

    const existingApplication =
      await applications.findOne({
        jobId: new ObjectId(jobId),
        email: email.trim().toLowerCase(),
      });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message:
          "You have already applied for this job",
      });
    }

    const application = {
      jobId: new ObjectId(jobId),

      jobTitle: job.title,

      companyName: job.companyName,

      name: name.trim(),

      email: email.trim().toLowerCase(),

      phone: phone?.trim() || "",

      resume: resume.trim(),

      coverLetter: coverLetter.trim(),

      status: "Pending",

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    const result = await applications.insertOne(
      application
    );

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application: {
        _id: result.insertedId,
        ...application,
      },
    });
  } catch (error) {
    console.error("APPLICATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
});

/* =========================================
   UPDATE APPLICATION STATUS
========================================= */

app.put("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Reviewing",
      "Shortlisted",
      "Rejected",
      "Accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const result = await applications.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application status updated",
    });
  } catch (error) {
    console.error(
      "UPDATE APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update application",
    });
  }
});

/* =========================================
   DELETE APPLICATION
========================================= */

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const result = await applications.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE APPLICATION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete application",
    });
  }
});

/* =========================================
   DASHBOARD STATISTICS
========================================= */

app.get("/api/stats", async (req, res) => {
  try {
    const [
      jobCount,
      companyCount,
      categoryCount,
      applicationCount,
    ] = await Promise.all([
      jobs.countDocuments(),
      companies.countDocuments(),
      categories.countDocuments(),
      applications.countDocuments(),
    ]);

    const featuredJobs = await jobs.countDocuments({
      featured: true,
    });

    res.json({
      success: true,
      stats: {
        jobs: jobCount,
        companies: companyCount,
        categories: categoryCount,
        applications: applicationCount,
        featuredJobs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load statistics",
    });
  }
});

/* =========================================
   404
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =========================================
   START SERVER
========================================= */

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(
      `NEXORA server running at http://localhost:${PORT}`
    );
  });
}

startServer();