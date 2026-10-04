const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

const DB_NAME =
  process.env.DB_NAME || "nexora_job_board";

async function seedDatabase() {
  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    const categories =
      db.collection("categories");

    const companies =
      db.collection("companies");

    const jobs =
      db.collection("jobs");

    const applications =
      db.collection("applications");

    /* =====================================
       CLEAR OLD DATA
    ===================================== */

    await applications.deleteMany({});
    await jobs.deleteMany({});
    await companies.deleteMany({});
    await categories.deleteMany({});

    /* =====================================
       CATEGORIES
    ===================================== */

    const categoryData = [
      {
        name: "Web Development",
        description:
          "Frontend, backend and full-stack development opportunities.",
      },
      {
        name: "UI/UX Design",
        description:
          "Creative design and user experience opportunities.",
      },
      {
        name: "Marketing",
        description:
          "Digital marketing, SEO and brand growth roles.",
      },
      {
        name: "Finance",
        description:
          "Finance, accounting and investment opportunities.",
      },
      {
        name: "Human Resources",
        description:
          "People, recruitment and talent management roles.",
      },
      {
        name: "Data & AI",
        description:
          "Data science, analytics and artificial intelligence roles.",
      },
    ];

    const categoryResult =
      await categories.insertMany(
        categoryData.map((category) => ({
          ...category,
          createdAt: new Date(),
        }))
      );

    const categoryIds =
      categoryResult.insertedIds;

    const webCategory =
      categoryIds[0];

    const designCategory =
      categoryIds[1];

    const marketingCategory =
      categoryIds[2];

    const financeCategory =
      categoryIds[3];

    const hrCategory =
      categoryIds[4];

    const aiCategory =
      categoryIds[5];

    /* =====================================
       COMPANIES
    ===================================== */

    const companyData = [
      {
        name: "NEXORA Technologies",
        logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=300&q=80",
        description:
          "A modern technology company building digital products for ambitious businesses.",
        website: "https://example.com",
        location: "Dhaka, Bangladesh",
        industry: "Technology",
      },

      {
        name: "PixelCraft Studio",
        logo: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80",
        description:
          "A creative studio focused on digital experiences and product design.",
        website: "https://example.com",
        location: "Dhaka, Bangladesh",
        industry: "Design",
      },

      {
        name: "Vertex Finance",
        logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=300&q=80",
        description:
          "A growing financial services company delivering modern financial solutions.",
        website: "https://example.com",
        location: "Singapore",
        industry: "Finance",
      },

      {
        name: "GrowthLab",
        logo: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80",
        description:
          "A performance marketing company helping brands scale globally.",
        website: "https://example.com",
        location: "Remote",
        industry: "Marketing",
      },
    ];

    const companyResult =
      await companies.insertMany(
        companyData.map((company) => ({
          ...company,
          createdAt: new Date(),
        }))
      );

    const companyIds =
      companyResult.insertedIds;

    const nexora =
      companyIds[0];

    const pixelCraft =
      companyIds[1];

    const vertex =
      companyIds[2];

    const growthLab =
      companyIds[3];

    /* =====================================
       JOBS
    ===================================== */

    const jobData = [
      {
        title: "Senior Frontend Developer",

        companyId: nexora,

        categoryId: webCategory,

        companyName:
          "NEXORA Technologies",

        categoryName:
          "Web Development",

        location:
          "Dhaka, Bangladesh",

        type: "Full Time",

        salary:
          "$1,200 - $1,800",

        experience:
          "3+ Years",

        description:
          "We are looking for a passionate Senior Frontend Developer to build beautiful, scalable and high-performance web applications.",

        requirements: [
          "3+ years of frontend development experience",
          "Strong knowledge of React and Next.js",
          "Excellent TypeScript skills",
          "Experience with REST APIs",
          "Understanding of responsive design",
        ],

        responsibilities: [
          "Build modern web applications",
          "Work closely with designers",
          "Create reusable React components",
          "Optimize application performance",
          "Review code and mentor developers",
        ],

        skills: [
          "React",
          "Next.js",
          "TypeScript",
          "JavaScript",
          "Tailwind CSS",
        ],

        featured: true,

        deadline:
          new Date("2026-12-15"),

        createdAt:
          new Date("2026-09-20"),

        updatedAt:
          new Date("2026-09-20"),
      },

      {
        title: "Product UI/UX Designer",

        companyId: pixelCraft,

        categoryId: designCategory,

        companyName:
          "PixelCraft Studio",

        categoryName:
          "UI/UX Design",

        location:
          "Remote",

        type: "Full Time",

        salary:
          "$900 - $1,400",

        experience:
          "2+ Years",

        description:
          "Join our creative team and design elegant digital products used by customers around the world.",

        requirements: [
          "Strong portfolio",
          "Experience with Figma",
          "Understanding of UX principles",
          "Strong visual design skills",
          "Ability to collaborate with developers",
        ],

        responsibilities: [
          "Design product interfaces",
          "Create user flows",
          "Build prototypes",
          "Conduct design research",
          "Maintain design systems",
        ],

        skills: [
          "Figma",
          "UI Design",
          "UX Design",
          "Prototyping",
          "Design Systems",
        ],

        featured: true,

        deadline:
          new Date("2026-11-30"),

        createdAt:
          new Date("2026-09-22"),

        updatedAt:
          new Date("2026-09-22"),
      },

      {
        title: "Digital Marketing Specialist",

        companyId: growthLab,

        categoryId: marketingCategory,

        companyName:
          "GrowthLab",

        categoryName:
          "Marketing",

        location:
          "Remote",

        type: "Full Time",

        salary:
          "$700 - $1,100",

        experience:
          "2+ Years",

        description:
          "We are searching for a data-driven marketer to help international brands grow their digital presence.",

        requirements: [
          "Experience with digital marketing",
          "Knowledge of SEO",
          "Understanding of analytics",
          "Excellent communication skills",
        ],

        responsibilities: [
          "Develop marketing campaigns",
          "Analyze campaign performance",
          "Manage SEO strategies",
          "Create growth reports",
        ],

        skills: [
          "SEO",
          "Google Analytics",
          "Content Marketing",
          "Social Media",
          "Growth Marketing",
        ],

        featured: false,

        deadline:
          new Date("2026-11-20"),

        createdAt:
          new Date("2026-09-24"),

        updatedAt:
          new Date("2026-09-24"),
      },

      {
        title: "Financial Analyst",

        companyId: vertex,

        categoryId: financeCategory,

        companyName:
          "Vertex Finance",

        categoryName:
          "Finance",

        location:
          "Singapore",

        type: "Full Time",

        salary:
          "$2,000 - $3,000",

        experience:
          "3+ Years",

        description:
          "Analyze financial data and provide insights that support strategic business decisions.",

        requirements: [
          "Degree in finance or related field",
          "Strong analytical skills",
          "Advanced Excel knowledge",
          "Excellent communication",
        ],

        responsibilities: [
          "Analyze financial reports",
          "Prepare forecasts",
          "Build financial models",
          "Support strategic planning",
        ],

        skills: [
          "Financial Analysis",
          "Excel",
          "Financial Modeling",
          "Forecasting",
        ],

        featured: false,

        deadline:
          new Date("2026-12-01"),

        createdAt:
          new Date("2026-09-25"),

        updatedAt:
          new Date("2026-09-25"),
      },

      {
        title: "AI & Data Engineer",

        companyId: nexora,

        categoryId: aiCategory,

        companyName:
          "NEXORA Technologies",

        categoryName:
          "Data & AI",

        location:
          "Dhaka, Bangladesh",

        type: "Full Time",

        salary:
          "$1,500 - $2,300",

        experience:
          "3+ Years",

        description:
          "Work on intelligent products using modern machine learning and data engineering technologies.",

        requirements: [
          "Strong Python knowledge",
          "Experience with data pipelines",
          "Machine learning fundamentals",
          "Database knowledge",
        ],

        responsibilities: [
          "Build data pipelines",
          "Develop ML solutions",
          "Analyze large datasets",
          "Deploy machine learning systems",
        ],

        skills: [
          "Python",
          "Machine Learning",
          "MongoDB",
          "Data Engineering",
          "AI",
        ],

        featured: true,

        deadline:
          new Date("2026-12-20"),

        createdAt:
          new Date("2026-09-27"),

        updatedAt:
          new Date("2026-09-27"),
      },
    ];

    const jobResult =
      await jobs.insertMany(jobData);

    /* =====================================
       SAMPLE APPLICATIONS
    ===================================== */

    const firstJobId =
      jobResult.insertedIds[0];

    const secondJobId =
      jobResult.insertedIds[1];

    await applications.insertMany([
      {
        jobId: firstJobId,

        jobTitle:
          "Senior Frontend Developer",

        companyName:
          "NEXORA Technologies",

        name: "Alex Morgan",

        email:
          "alex@example.com",

        phone:
          "+8801700000000",

        resume:
          "https://example.com/resume/alex",

        coverLetter:
          "I am excited to apply for the Senior Frontend Developer position.",

        status: "Reviewing",

        createdAt:
          new Date("2026-09-28"),

        updatedAt:
          new Date("2026-09-28"),
      },

      {
        jobId: secondJobId,

        jobTitle:
          "Product UI/UX Designer",

        companyName:
          "PixelCraft Studio",

        name: "Taylor Smith",

        email:
          "taylor@example.com",

        phone:
          "+8801800000000",

        resume:
          "https://example.com/resume/taylor",

        coverLetter:
          "I would love to bring my product design experience to PixelCraft Studio.",

        status: "Pending",

        createdAt:
          new Date("2026-09-29"),

        updatedAt:
          new Date("2026-09-29"),
      },
    ]);

    /* =====================================
       SUCCESS
    ===================================== */

    console.log("");
    console.log("=================================");
    console.log("NEXORA DATABASE SEEDED SUCCESSFULLY");
    console.log("=================================");
    console.log("");

    console.log(
      `Categories: ${categoryData.length}`
    );

    console.log(
      `Companies: ${companyData.length}`
    );

    console.log(
      `Jobs: ${jobData.length}`
    );

    console.log(
      "Applications: 2"
    );

    console.log("");
  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );
  } finally {
    await client.close();
  }
}

seedDatabase();