/* ============================================================
   OneClicq — single source of truth for the website.
   Edit values here, then run:  node tools/build.js
   The build writes the header, footer, <head> tags, schema,
   company numbers, robots.txt and sitemap.xml into every page.
   ============================================================ */
module.exports = {
  brand: "OneClicq",
  domain: "https://oneclicq.in", // main domain (oneclicq.com 301-redirects here)
  ogImage: "/assets/img/og.png",
  themeColor: "#FFFFFF",
  assetVersion: "6", // bump when main.css / main.js change, to bust caches

  contact: {
    email: "hello@oneclicq.in",
    phone: "+91-9667555188",
    phoneDisplay: "+91 96675 55188",
    whatsapp: "919667555188", // digits only, no +; set to "" to hide WhatsApp
    hours: "Mon–Fri, 9:00–18:00 IST",
    hoursSchema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
    address: {
      street: "Office No. 1427, 14th Floor, Ufairia Mall, Ek Murti Chowk",
      locality: "Greater Noida West",
      region: "Uttar Pradesh",
      postalCode: "201318",
      country: "IN"
    }
  },

  /* Company numbers — used on Home, About and Case Studies.
     !! Confirm each figure against company records before publishing. */
  stats: {
    projects: { value: 50, suffix: "+", label: "Projects Delivered" },
    specialists: { value: 20, suffix: "+", label: "Specialists" },
    industries: { value: 10, suffix: "+", label: "Industries Served" },
    years: { value: 5, suffix: "+", label: "Years in Business" }
  },

  /* ---------- Proof (fix plan H8) ----------
     Nothing here is shown on the site until `verified: true`.
     Set it only after the client has confirmed the quote / figures in writing
     and agreed to be named. Photos and logos go in assets/img/clients/.
     If no testimonial is verified, the whole Testimonials section is hidden. */
  testimonials: [
    { verified: false,
      quote: "OneClicq rebuilt our platform in six months and it hasn't blinked since. They think like owners, not vendors.",
      name: "Anita Rao", role: "VP Engineering", company: "FinEdge",
      photo: "", logo: "", linkedin: "" },
    { verified: false,
      quote: "Their AI team delivered a forecasting engine that actually moved our numbers. Rare to find that combination of research and shipping.",
      name: "Marcus Bell", role: "COO", company: "NorthRetail",
      photo: "", logo: "", linkedin: "" },
    { verified: false,
      quote: "Clear communication, senior engineers, and a product that felt premium from day one. Exactly what we hoped for.",
      name: "Sara Idris", role: "Founder", company: "Lumen Health",
      photo: "", logo: "", linkedin: "" }
  ],

  /* Measurable results on case-study cards, keyed by data-case="…".
     Shown only when verified: true (backed by records the client agrees to share). */
  caseResults: {
    "realtime-payments-platform": { verified: false, results: [["78%", "Faster processing"]] },
    "ai-demand-forecasting": { verified: false, results: [["41%", "Fewer stockouts"], ["200+", "Retail locations"]] },
    "enterprise-erp-transformation": { verified: false, results: [["65%", "Efficiency increase"], ["40%", "Cost reduction"]] },
    "ai-powered-business-automation": { verified: false, results: [["70%", "Faster response"], ["50%", "Lower workload"]] },
    "crm-modernization-platform": { verified: false, results: [["45%", "More conversions"], ["60%", "Faster sales cycle"]] },
    "executive-analytics-dashboard": { verified: false, results: [["90%", "Reporting accuracy"], ["55%", "Faster insights"]] },
    "scalable-e-commerce-platform": { verified: false, results: [["3X", "Revenue growth"], ["99.9%", "Platform uptime"]] },
    "enterprise-ai-assistant": { verified: false, results: [["80%", "Faster responses"], ["65%", "Productivity boost"]] }
  },

  /* Real profile URLs only. Leave empty to hide. */
  socials: [
    // ["LinkedIn", "https://www.linkedin.com/company/oneclicq", "bi-linkedin"],
    // ["Instagram", "https://www.instagram.com/oneclicq", "bi-instagram"],
  ],

  mega: [
    { h: "Development Services", items: [
      ["Custom Software Development", "services/software-development.html"],
      ["Web Application Development", "services/web-development.html"],
      ["Mobile App Development", "services/mobile-development.html"]
    ] },
    { h: "AI & Cloud", items: [
      ["AI & Machine Learning Solutions", "services/ai-solutions.html"],
      ["Cloud Migration", "services/cloud-migration.html"]
    ] },
    { h: "Integration Services", items: [
      ["API Development & Integration", "services/api-development.html"],
      ["Payment Gateway Integration", "services/payment-gateway.html"]
    ] },
    { h: "Business Solutions", items: [
      ["E-commerce Development", "services/ecommerce-solutions.html"],
      ["Software Maintenance & Support", "services/software-maintenance.html"]
    ] }
  ],

  nav: [
    ["About", "about.html"],
    ["Services", "services.html", true],
    ["Solutions", "solutions.html"],
    ["Industries", "industries.html"],
    ["Products", "products.html"],
    ["Technologies", "technologies.html"],
    ["Careers", "careers.html"],
    ["Contact", "contact.html"]
  ],

  footCols: [
    ["Company", [["About", "about.html"], ["Careers", "careers.html"], ["Case Studies", "case-studies.html"], ["FAQ", "faq.html"], ["Contact", "contact.html"]]],
    ["Services", [
      ["Custom Software Development", "services/software-development.html"],
      ["Web Application Development", "services/web-development.html"],
      ["Mobile App Development", "services/mobile-development.html"],
      ["AI & Machine Learning", "services/ai-solutions.html"],
      ["Cloud Migration", "services/cloud-migration.html"],
      ["All Services", "services.html"]
    ]],
    ["Solutions", [
      ["ERP", "solutions/erp.html"],
      ["CRM", "solutions/crm.html"],
      ["SaaS", "solutions/saas.html"],
      ["Business Automation", "solutions/business-automation.html"],
      ["Enterprise Management", "solutions/enterprise-management.html"],
      ["E-Commerce Platforms", "solutions/ecommerce.html"],
      ["Customer Portals", "solutions/customer-portals.html"]
    ]],
    ["Explore", [["Blog", "blog/"], ["Industries", "industries.html"], ["Products", "products.html"], ["Technologies", "technologies.html"], ["Solutions", "solutions.html"]]]
  ],

  /* Per-page SEO. title: 50–60 chars, description: 140–155 chars.
     crumb: breadcrumb label. type: "service" adds Service schema.
     noindex: keep out of search + sitemap. */
  pages: {
    "index.html": {
      title: "Software Development Company in Noida | OneClicq",
      description: "OneClicq builds custom software, web and mobile apps, AI and cloud solutions for growing businesses. Based in Greater Noida, working with clients India-wide.",
      priority: "1.0"
    },
    "about.html": {
      title: "About OneClicq | Software Company in Greater Noida",
      description: "Meet OneClicq, a Greater Noida software team of engineers, designers and strategists building reliable software, AI and cloud products since 2021.",
      crumb: "About"
    },
    "services.html": {
      title: "Software Development Services in Noida | OneClicq",
      description: "Custom software, web and mobile apps, AI, cloud migration, APIs, payment gateways, e-commerce and support. Explore OneClicq's services in Noida, India.",
      crumb: "Services"
    },
    "solutions.html": {
      title: "ERP, CRM & SaaS Business Solutions | OneClicq",
      description: "Business platforms you can adopt fast and tailor deeply: ERP, CRM, SaaS, automation, customer portals and e-commerce, built by OneClicq in Noida, India.",
      crumb: "Solutions"
    },
    "industries.html": {
      title: "Industry Software Solutions in India | OneClicq",
      description: "Software for construction, hospitality, education, healthcare, retail, finance, logistics and more. See how OneClicq adapts technology to each industry.",
      crumb: "Industries"
    },
    "products.html": {
      title: "ERP, CRM & Business Software Products | OneClicq",
      description: "Explore OneClicq products: QuantumERP, RelateCRM, StayFlow, BuildCore, LearnHub, FlowOps and Cognify. Request a demo to see each one with your workflow.",
      crumb: "Products"
    },
    "technologies.html": {
      title: "Our Technology Stack: .NET, React, AI, Cloud | OneClicq",
      description: "The frontend, backend, cloud, database, AI and DevOps tools OneClicq uses to build secure, scalable software, and how we choose the right stack per project.",
      crumb: "Technologies"
    },
    "case-studies.html": {
      title: "Software Development Case Studies | OneClicq",
      description: "See how OneClicq has helped businesses modernise systems, automate workflows and launch digital products across finance, retail, healthcare and more.",
      crumb: "Case Studies"
    },
    "careers.html": {
      title: "Careers at OneClicq | IT Jobs in Greater Noida",
      description: "Join OneClicq in Greater Noida. Apply for software, web, mobile, AI, cloud, QA and design roles or internships. Upload your resume and we'll be in touch.",
      crumb: "Careers"
    },
    "contact.html": {
      title: "Contact OneClicq | Software Company in Greater Noida",
      description: "Talk to OneClicq about your software, app or AI project. Call +91 96675 55188, email hello@oneclicq.in or visit our Greater Noida West office.",
      crumb: "Contact"
    },
    "faq.html": {
      title: "Software Development FAQs: Cost, Timelines | OneClicq",
      description: "Answers to common questions about working with OneClicq: project cost and timelines, technologies, support, security, ownership of code and how to begin.",
      crumb: "FAQ",
      faqSchema: true
    },
    "privacy-policy.html": {
      title: "Privacy Policy | OneClicq",
      description: "How OneClicq collects, uses, stores and protects personal information shared through our website, contact form and careers application form.",
      crumb: "Privacy Policy"
    },
    "cookie-policy.html": {
      title: "Cookie Policy | OneClicq",
      description: "What the OneClicq website stores on your device, why, and how to control it. We currently use no analytics or advertising cookies on this site.",
      crumb: "Cookie Policy"
    },
    "terms.html": {
      title: "Terms of Use | OneClicq",
      description: "The terms that apply when you use the OneClicq website, including acceptable use, intellectual property, links to other sites and limits of liability.",
      crumb: "Terms of Use"
    },
    "404.html": {
      title: "Page Not Found | OneClicq",
      description: "The page you were looking for could not be found. Browse OneClicq services, solutions and products, or contact our team in Greater Noida for help.",
      crumb: "Page not found",
      noindex: true, absolute: true
    },

    /* ---------- Blog (articles: type "article" adds BlogPosting schema) ---------- */
    "blog/index.html": {
      title: "Software, AI and Cloud Insights Blog | OneClicq",
      description: "Practical guides from the OneClicq team on generative AI, cloud migration, legacy modernisation, automation and choosing technology that lasts.",
      crumb: "Blog", type: "blog"
    },
    "blog/generative-ai-enterprise-roi.html": {
      title: "Where Generative AI Pays Off in Business | OneClicq",
      description: "Where generative AI delivers real value in a business today, where it doesn't yet, and a simple way to choose and measure your first AI project.",
      crumb: "Where generative AI actually pays off", parent: ["Blog", "blog/"], type: "article",
      h1: "Where generative AI actually pays off in the enterprise", date: "2026-11-09",
      image: "assets/img/stock/1677442136019-21780ecad995-1200.webp"
    },
    "blog/zero-downtime-cloud-migration.html": {
      title: "Zero-Downtime Cloud Migration: A Practical Guide | OneClicq",
      description: "How to move critical business systems to AWS or Azure without an outage: assessment, migration patterns, data sync, cut-over and rollback planning.",
      crumb: "Zero-downtime cloud migration", parent: ["Blog", "blog/"], type: "article",
      h1: "A pragmatic guide to zero-downtime cloud migration", date: "2026-11-09",
      image: "assets/img/stock/1451187580459-43490279c0fa-1200.webp"
    },
    "blog/software-that-survives-year-two.html": {
      title: "Designing Software That Lasts Past Year Two | OneClicq",
      description: "The architecture, testing and documentation decisions that keep business software easy to change and affordable to run long after launch day.",
      crumb: "Software that survives its second year", parent: ["Blog", "blog/"], type: "article",
      h1: "Designing software that survives its second year", date: "2026-11-09",
      image: "assets/img/stock/1516321318423-f06f85e504b3-1200.webp"
    },
    "blog/legacy-modernization-checklist.html": {
      title: "Legacy System Modernisation Checklist | OneClicq",
      description: "A step-by-step checklist for modernising legacy business software: where to start, what to sequence, and how to reduce risk at every stage.",
      crumb: "Legacy modernisation checklist", parent: ["Blog", "blog/"], type: "article",
      h1: "A CIO's checklist for legacy modernisation", date: "2026-11-09",
      image: "assets/img/stock/1551288049-bebda4e38f71-1200.webp"
    },
    "blog/automation-that-pays-back.html": {
      title: "Business Automation That Pays Back Fast | OneClicq",
      description: "How to find the workflows where automation pays for itself within a quarter, estimate the return before you build, and avoid automating waste.",
      crumb: "Automation that pays for itself", parent: ["Blog", "blog/"], type: "article",
      h1: "Automation that pays for itself in a quarter", date: "2026-11-09",
      image: "assets/img/stock/1520607162513-77705c0f0d4a-1200.webp"
    },
    "blog/choosing-a-tech-stack.html": {
      title: "How to Choose a Tech Stack That Lasts | OneClicq",
      description: "A practical framework for choosing frontend, backend, database and cloud technology you won't regret in three years, with questions to ask first.",
      crumb: "Choosing a tech stack", parent: ["Blog", "blog/"], type: "article",
      h1: "Choosing a tech stack you won't regret in three years", date: "2026-11-09",
      image: "assets/img/stock/1558494949-ef010cbdcc31-1200.webp"
    },

    "services/software-development.html": {
      title: "Custom Software Development in Noida | OneClicq",
      description: "Custom software built around your processes: discovery, architecture, development, testing and support from OneClicq's engineering team in Noida.",
      crumb: "Custom Software Development", parent: ["Services", "services.html"], type: "service"
    },
    "services/web-development.html": {
      title: "Web Application Development Company in Noida | OneClicq",
      description: "Fast, secure and responsive web applications, portals and dashboards built with React, Angular, Next.js and .NET by OneClicq's team in Noida, India.",
      crumb: "Web Application Development", parent: ["Services", "services.html"], type: "service"
    },
    "services/mobile-development.html": {
      title: "Mobile App Development Company in Noida | OneClicq",
      description: "Android, iOS and cross-platform Flutter apps designed, built and launched by OneClicq. From MVP to store release and ongoing updates, based in Noida.",
      crumb: "Mobile App Development", parent: ["Services", "services.html"], type: "service"
    },
    "services/ai-solutions.html": {
      title: "AI & Machine Learning Development in India | OneClicq",
      description: "AI agents, generative AI, document processing and predictive models built into your real workflows. OneClicq's AI development services in Noida, India.",
      crumb: "AI & Machine Learning Solutions", parent: ["Services", "services.html"], type: "service"
    },
    "services/cloud-migration.html": {
      title: "Cloud Migration Services: AWS & Azure | OneClicq",
      description: "Plan and run a low-risk move to AWS or Azure: assessment, re-platforming, data migration and cost tuning, delivered by OneClicq's cloud team in Noida.",
      crumb: "Cloud Migration", parent: ["Services", "services.html"], type: "service"
    },
    "services/api-development.html": {
      title: "API Development & Integration Services | OneClicq",
      description: "Secure REST APIs and integrations that connect your apps, ERPs, CRMs and third-party services. Design, build, documentation and monitoring by OneClicq.",
      crumb: "API Development & Integration", parent: ["Services", "services.html"], type: "service"
    },
    "services/payment-gateway.html": {
      title: "Payment Gateway Integration in India | OneClicq",
      description: "Integrate Razorpay, PayU, Stripe, UPI and other payment gateways into your website or app, with secure checkout, webhooks and reconciliation by OneClicq.",
      crumb: "Payment Gateway Integration", parent: ["Services", "services.html"], type: "service"
    },
    "services/ecommerce-solutions.html": {
      title: "Custom E-commerce Website Development | OneClicq",
      description: "Custom e-commerce website and app development: storefront design, catalogue, checkout, payments and integrations, built to your brief by OneClicq.",
      crumb: "E-commerce Development", parent: ["Services", "services.html"], type: "service"
    },
    "services/software-maintenance.html": {
      title: "Software Maintenance & Support Services | OneClicq",
      description: "Keep your software secure and running: bug fixes, updates, monitoring, performance tuning and feature work under a clear support plan from OneClicq.",
      crumb: "Software Maintenance & Support", parent: ["Services", "services.html"], type: "service"
    },

    "solutions/erp.html": {
      title: "Custom ERP Software Development in India | OneClicq",
      description: "ERP software that unifies finance, inventory, purchasing, HR and operations in one system, configured to how your business works. Built by OneClicq.",
      crumb: "ERP", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/crm.html": {
      title: "Custom CRM Software Development in India | OneClicq",
      description: "CRM software for leads, pipeline, follow-ups and customer service, with the reports and integrations your sales team actually needs. Built by OneClicq.",
      crumb: "CRM", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/saas.html": {
      title: "SaaS Product Development Company in India | OneClicq",
      description: "Build a multi-tenant SaaS product with subscriptions, user roles, billing and analytics. OneClicq takes SaaS ideas from MVP to a scalable platform.",
      crumb: "SaaS", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/business-automation.html": {
      title: "Business Process Automation Solutions | OneClicq",
      description: "Automate approvals, data entry, reports and notifications across your tools. OneClicq builds workflow automation that saves time and reduces errors.",
      crumb: "Business Automation", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/enterprise-management.html": {
      title: "Enterprise Management Software Solutions | OneClicq",
      description: "Enterprise software to manage projects, assets, teams and compliance across departments, with dashboards and role-based access. Built by OneClicq.",
      crumb: "Enterprise Management", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/ecommerce.html": {
      title: "Ready E-Commerce Platform for Your Business | OneClicq",
      description: "A ready-built e-commerce platform with storefront, orders, inventory and payments that you can launch fast and brand as your own. From OneClicq, India.",
      crumb: "E-Commerce Platform", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/customer-portals.html": {
      title: "Customer Portal Development Services | OneClicq",
      description: "Self-service customer portals for orders, invoices, tickets and documents, connected to your ERP or CRM. Designed and built by OneClicq in Noida.",
      crumb: "Customer Portals", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/ai-platforms.html": {
      title: "AI Platform Development for Businesses | OneClicq",
      description: "AI platforms that bring chat assistants, document understanding and predictions into one secure place for your teams. Designed and built by OneClicq.",
      crumb: "AI Platforms", parent: ["Solutions", "solutions.html"], type: "service"
    },
    "solutions/business-intelligence.html": {
      title: "Business Intelligence & Dashboard Solutions | OneClicq",
      description: "Business intelligence dashboards that pull data from your systems into clear, live reports for faster decisions. Data pipelines and BI by OneClicq.",
      crumb: "Business Intelligence", parent: ["Solutions", "solutions.html"], type: "service"
    }
  }
};
