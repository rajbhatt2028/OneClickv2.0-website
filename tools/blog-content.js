/* ============================================================
   OneClicq blog — article content.
   Edit text here, then run:  node tools/blog.js && node tools/build.js
   Each body is plain HTML (h2/h3/p/ul/ol/blockquote). Keep claims general:
   no client names or numbers unless they are real and approved.
   ============================================================ */
module.exports = [
  {
    slug: "generative-ai-enterprise-roi",
    tag: "AI",
    title: "Where generative AI actually pays off in the enterprise",
    summary: "Cutting through the hype to the workflows where generative AI delivers real value today, and how to pick and measure your first project.",
    date: "2026-11-09", read: 6,
    img: "1677442136019-21780ecad995", w: 1200, h: 675,
    alt: "Abstract illustration of an artificial intelligence network",
    related: [["AI & Machine Learning Solutions", "../services/ai-solutions.html"], ["AI Platforms", "../solutions/ai-platforms.html"]],
    body: `
<p class="article-lead">Most businesses have now tried a chatbot or two. Far fewer can point to a generative AI project that saves real money every month. The gap is rarely the technology. It is usually the choice of problem.</p>

<h2>Start with the work, not the model</h2>
<p>Generative AI is good at a specific kind of task: reading, summarising, drafting and reformatting language at speed. It is much weaker at tasks that need guaranteed accuracy, fresh facts it has never seen, or judgement that carries legal or financial risk. The projects that pay off line up with the first list and keep a person in charge of the second.</p>
<p>A useful test is to look for work that is <strong>high volume, text heavy and reviewable</strong>. If your team does something hundreds of times a month, the input is mostly documents or messages, and a person can check the output in seconds, it is a strong candidate.</p>

<h2>Five places it reliably earns its keep</h2>
<h3>1. Document intake and data extraction</h3>
<p>Invoices, purchase orders, KYC forms, insurance claims and delivery notes arrive in every format imaginable. A language model can read them, pull out the fields you need and hand them to your ERP or CRM, with low-confidence cases sent to a person. This removes hours of manual typing without removing control.</p>
<h3>2. Customer support drafting</h3>
<p>Instead of answering customers directly, the model drafts a reply from your help articles and past tickets, and an agent edits and sends it. Agents handle more tickets, answers become more consistent, and nothing goes out unchecked.</p>
<h3>3. Search across internal knowledge</h3>
<p>Policies, SOPs, contracts and project notes are usually scattered across drives and inboxes. Retrieval-augmented generation (RAG) lets staff ask a question in plain language and get an answer with links to the source documents, so they can verify it.</p>
<h3>4. Sales and proposal preparation</h3>
<p>First drafts of proposals, RFP responses and follow-up emails, built from your own templates and product information, give sales teams a head start. The final wording stays with the person who owns the client relationship.</p>
<h3>5. Code and test assistance</h3>
<p>For software teams, AI assistants speed up boilerplate, test writing and documentation. The gain is real but modest, and it depends on strong code review.</p>

<h2>Where to be careful</h2>
<ul>
  <li><strong>Unchecked customer-facing answers.</strong> A model can state wrong information with confidence. Anything that reaches customers without review needs tight limits on what it may say.</li>
  <li><strong>Sensitive data.</strong> Decide what data may leave your systems, choose providers and settings that do not train on your inputs, and log what is sent.</li>
  <li><strong>Decisions with legal weight.</strong> Credit, hiring, medical or legal decisions need human judgement and an audit trail, with AI as an assistant at most.</li>
</ul>

<h2>How to choose and measure your first project</h2>
<ol>
  <li><strong>Pick one workflow</strong> with a clear owner, a measurable volume and an existing manual cost.</li>
  <li><strong>Measure the baseline</strong>: time per item, error rate and backlog, before you build anything.</li>
  <li><strong>Build a narrow pilot</strong> with a person reviewing every output for the first few weeks.</li>
  <li><strong>Compare against the baseline</strong>, including the time spent reviewing, not just the time saved.</li>
  <li><strong>Scale only what works</strong>, and reduce review gradually where accuracy proves itself.</li>
</ol>
<p>A focused pilot like this usually takes weeks, not months, and gives you a real number to take to the board instead of a demo.</p>

<h2>The takeaway</h2>
<p>Generative AI pays off when it removes repetitive language work from skilled people and leaves them to check, decide and handle exceptions. Start small, measure honestly and keep people in the loop where mistakes are costly.</p>`
  },

  {
    slug: "zero-downtime-cloud-migration",
    tag: "Cloud",
    title: "A pragmatic guide to zero-downtime cloud migration",
    summary: "How to move critical systems to AWS or Azure without holding your breath: assessment, migration patterns, data sync, cut-over and rollback.",
    date: "2026-11-09", read: 7,
    img: "1451187580459-43490279c0fa", w: 1200, h: 798,
    alt: "Network of connected points over the earth representing cloud infrastructure",
    related: [["Cloud Migration", "../services/cloud-migration.html"], ["Software Maintenance & Support", "../services/software-maintenance.html"]],
    body: `
<p class="article-lead">For a system your business runs on every day, the hardest part of a cloud migration is not the cloud. It is moving without customers, staff or partners noticing. That is a planning problem, and it can be solved.</p>

<h2>1. Know exactly what you are moving</h2>
<p>Start with an inventory of every application, database, scheduled job, file share and integration. For each one, write down who owns it, what depends on it, how much downtime the business can tolerate, and how much data changes per hour. Hidden dependencies, such as a nightly export another team relies on, cause more failed migrations than any technical issue.</p>

<h2>2. Choose a migration pattern per system</h2>
<ul>
  <li><strong>Rehost ("lift and shift")</strong>: move virtual machines largely as they are. Fastest, least change, fewest cloud savings.</li>
  <li><strong>Replatform</strong>: keep the application but move to managed services, such as a managed database or app hosting. A good balance for most business systems.</li>
  <li><strong>Refactor</strong>: rebuild parts of the application for the cloud. Highest benefit and highest effort; best saved for systems with a clear business case.</li>
  <li><strong>Retire or replace</strong>: some systems are better switched off or replaced by a SaaS product.</li>
</ul>
<p>Mixing patterns is normal. Rehost the low-risk systems first to build confidence, and refactor only where it pays.</p>

<h2>3. Build the landing zone first</h2>
<p>Before moving any workload, set up the foundations in AWS or Azure: accounts or subscriptions, networking, identity and access, backups, logging, monitoring and cost alerts. Doing this once, properly, prevents every later migration from inventing its own security rules.</p>

<h2>4. Keep data in sync until cut-over</h2>
<p>Downtime usually comes from the database. Instead of a long "stop, copy, start" window, replicate data continuously from the old system to the new one, using the database's own replication or a managed migration service. When it is time to switch, only the last few seconds of changes need to catch up.</p>

<h2>5. Run both environments side by side</h2>
<p>With data in sync, test the new environment with real traffic before anyone depends on it. Common approaches are:</p>
<ul>
  <li><strong>Read-only shadowing</strong>: send copies of real requests to the new system and compare results.</li>
  <li><strong>Gradual traffic shifting</strong>: move a small share of users first, using DNS weighting or a load balancer, then increase.</li>
  <li><strong>Blue-green switch</strong>: keep the old ("blue") environment running and switch everyone to the new ("green") one at once, with a one-step switch back.</li>
</ul>

<h2>6. Plan the cut-over like a launch</h2>
<ol>
  <li>Lower DNS time-to-live values a few days before, so changes take effect quickly.</li>
  <li>Freeze non-essential changes to both environments.</li>
  <li>Write a step-by-step runbook with owners, timings and checks for each step.</li>
  <li>Choose a low-traffic window and tell support teams in advance.</li>
  <li>Agree a clear rollback trigger, such as error rates above an agreed level, and rehearse the rollback.</li>
</ol>

<h2>7. Don't switch off the old system too early</h2>
<p>Keep the old environment available, read-only, for an agreed period after cut-over. Check reports, month-end processes and integrations that only run occasionally before you decommission anything.</p>

<h2>8. Tune costs after you land</h2>
<p>Cloud bills often rise straight after migration because servers are sized for the old peak. Once you have a few weeks of real usage data, right-size instances, schedule non-production environments to switch off at night, and commit to reserved capacity only for steady workloads.</p>

<h2>The takeaway</h2>
<p>Zero-downtime migration comes from preparation: a complete inventory, continuous data sync, testing with real traffic and a rehearsed rollback. With those in place, cut-over night becomes routine rather than risky.</p>`
  },

  {
    slug: "software-that-survives-year-two",
    tag: "Engineering",
    title: "Designing software that survives its second year",
    summary: "The architecture, testing and documentation decisions that keep business software easy to change and affordable to run long after launch day.",
    date: "2026-11-09", read: 6,
    img: "1516321318423-f06f85e504b3", w: 1200, h: 800,
    alt: "Developer working on a laptop",
    related: [["Custom Software Development", "../services/software-development.html"], ["Software Maintenance & Support", "../services/software-maintenance.html"]],
    body: `
<p class="article-lead">Launch day gets the attention, but the real test of business software comes in year two. That is when new requirements arrive, the original developers have moved on, and every change seems to break something else.</p>

<h2>Why software ages badly</h2>
<p>Software rarely fails all at once. It slows down: features take longer, bugs return, and the team becomes afraid to touch certain parts. The causes are predictable, and so are the habits that prevent them.</p>

<h2>1. Draw clear boundaries early</h2>
<p>Group code by business area, such as orders, billing, inventory and users, rather than by technical layer. Each area should own its data and expose a small, well-defined interface to the rest of the system. When the billing rules change, you then change one area, not twenty files across the codebase.</p>
<p>You do not need microservices to do this. A well-organised single application, often called a modular monolith, is cheaper to run and easier to change for most businesses.</p>

<h2>2. Keep business rules out of the screens</h2>
<p>Discount rules, approval limits and tax calculations hidden in buttons and forms get copied, and the copies drift apart. Put them in one place in the backend, test them there, and let every screen, API and report call the same logic.</p>

<h2>3. Test what would hurt</h2>
<p>Aim for useful tests rather than a coverage percentage. Automated tests should protect the paths that cost money or trust when they break: payments, invoicing, permissions, data imports and key calculations. Run them on every change so problems are caught in minutes, not by customers.</p>

<h2>4. Automate the boring operations</h2>
<ul>
  <li><strong>One-command deployments</strong> through a CI/CD pipeline, so releasing is routine rather than an event.</li>
  <li><strong>Database migrations in code</strong>, versioned alongside the application.</li>
  <li><strong>Monitoring and alerts</strong> for errors, slow pages and failed jobs, so you hear about problems before users do.</li>
  <li><strong>Automatic backups</strong> that are restored and tested regularly, not just taken.</li>
</ul>

<h2>5. Write down the decisions, not just the code</h2>
<p>New developers can read code; what they cannot see is why it was written that way. Keep short decision records: what was decided, the options considered and why. Add a setup guide that gets someone running locally in under an hour. This is what lets a business change teams without losing momentum.</p>

<h2>6. Plan for upgrades from the start</h2>
<p>Frameworks, libraries and operating systems all reach end of support. Budget a little time every month to keep dependencies current, rather than facing a risky, expensive upgrade every few years. It is also one of the simplest security measures available.</p>

<h2>7. Measure how it is really used</h2>
<p>Usage data shows which features matter and which nobody touches. Removing unused features is one of the cheapest ways to make a system simpler to maintain.</p>

<h2>A quick year-two health check</h2>
<ul>
  <li>Can a new developer set up the project and make a small change in their first day?</li>
  <li>Can you deploy safely on a weekday afternoon?</li>
  <li>Do automated tests cover payments, permissions and key calculations?</li>
  <li>Are all major dependencies still supported by their vendors?</li>
  <li>Would you know within minutes if a key process failed overnight?</li>
</ul>
<p>If the answer to any of these is no, that is where to invest next.</p>`
  },

  {
    slug: "legacy-modernization-checklist",
    tag: "Modernisation",
    title: "A CIO's checklist for legacy modernisation",
    summary: "Where to start, what to sequence, and how to de-risk the move away from ageing business software without stopping the business.",
    date: "2026-11-09", read: 7,
    img: "1551288049-bebda4e38f71", w: 1200, h: 800,
    alt: "Business analytics dashboard on a screen",
    related: [["Custom Software Development", "../services/software-development.html"], ["Cloud Migration", "../services/cloud-migration.html"], ["ERP Solutions", "../solutions/erp.html"]],
    body: `
<p class="article-lead">Most organisations run at least one system that everyone depends on and nobody wants to touch. Replacing it in one big project is tempting, and usually the riskiest option. A staged approach is slower to describe and faster to deliver.</p>

<h2>Stage 1: Understand what you have</h2>
<ul>
  <li><strong>List every function the system performs</strong>, including reports, exports and month-end jobs that only run occasionally.</li>
  <li><strong>Map integrations</strong>: which systems send data in, which take data out, and how (files, APIs, shared databases).</li>
  <li><strong>Find the real pain</strong>: speed, cost, security risk, missing features, or a shrinking pool of people who can maintain it.</li>
  <li><strong>Check data quality</strong> early. Years of duplicate and inconsistent records will follow you into any new system.</li>
  <li><strong>Identify the experts</strong> who understand the old system, and secure their time before you start.</li>
</ul>

<h2>Stage 2: Decide the approach</h2>
<p>There is no single right answer. For each part of the system, choose one:</p>
<ul>
  <li><strong>Keep and wrap</strong>: leave the core in place and put modern APIs around it so new tools can use its data.</li>
  <li><strong>Re-platform</strong>: move it to supported infrastructure or the cloud with minimal change.</li>
  <li><strong>Rebuild in stages</strong>: replace one module at a time with new software.</li>
  <li><strong>Replace with a product</strong>: adopt an off-the-shelf ERP, CRM or SaaS tool where your process is standard.</li>
</ul>

<h2>Stage 3: Sequence for early wins and low risk</h2>
<p>The most reliable pattern is to build new modules alongside the old system and move functions across one by one, often called the "strangler" approach. Start with an area that is valuable, fairly self-contained and not the riskiest, such as reporting, a customer portal or a single department's workflow. Each completed step reduces what the old system does until it can be switched off.</p>

<h2>Stage 4: Protect the business during the change</h2>
<ul>
  <li>Keep the old and new systems in sync while both are in use, and agree which one is the source of truth for each type of data.</li>
  <li>Migrate data in rehearsals first and compare totals, balances and record counts.</li>
  <li>Run old and new side by side for a period on critical processes such as billing and payroll.</li>
  <li>Have a written rollback plan for every release.</li>
</ul>

<h2>Stage 5: Bring people with you</h2>
<p>Modernisation fails as often from adoption as from technology. Involve the people who use the system daily in design decisions, train them before go-live, and give them a clear way to report problems in the first weeks.</p>

<h2>Stage 6: Measure and decommission</h2>
<p>Define success before you start: faster processing, fewer errors, lower running cost or reduced risk. Track it after each stage. Then actually switch off what you have replaced, including licences, servers and support contracts, so the savings are real.</p>

<h2>The one-page checklist</h2>
<ol>
  <li>Inventory of functions, integrations and data</li>
  <li>Named business owner and subject-matter experts</li>
  <li>Approach chosen per module, with reasons</li>
  <li>First module selected for value and low risk</li>
  <li>Data migration rehearsed and reconciled</li>
  <li>Parallel run and rollback plan for critical processes</li>
  <li>Training and support plan for users</li>
  <li>Success measures and a decommissioning date</li>
</ol>`
  },

  {
    slug: "automation-that-pays-back",
    tag: "Automation",
    title: "Automation that pays for itself in a quarter",
    summary: "How to find the workflows where automation delivers fast, real returns, estimate the payback before you build, and avoid automating waste.",
    date: "2026-11-09", read: 5,
    img: "1520607162513-77705c0f0d4a", w: 1200, h: 802,
    alt: "Team working together in an office",
    related: [["Business Automation", "../solutions/business-automation.html"], ["API Development & Integration", "../services/api-development.html"]],
    body: `
<p class="article-lead">Automation projects that pay back quickly have one thing in common: they target a specific, repetitive task with a known cost. Projects that drag on usually started with a vague goal like "digitise operations".</p>

<h2>Look for these signals</h2>
<ul>
  <li><strong>The same steps, many times a week</strong>: copying data between systems, sending standard emails, generating routine reports.</li>
  <li><strong>Clear rules</strong>: if a person can write the decision down as "if this, then that", software can follow it.</li>
  <li><strong>Digital inputs</strong>: emails, forms, spreadsheets and system records are far easier to automate than paper.</li>
  <li><strong>Visible cost of errors</strong>: late invoices, missed follow-ups, wrong stock levels or compliance misses.</li>
</ul>

<h2>Common quick wins</h2>
<ul>
  <li>Invoices and payment reminders created and sent automatically from your sales or ERP data</li>
  <li>New leads from your website, WhatsApp or marketplaces routed straight into the CRM with an owner assigned</li>
  <li>Approval workflows for purchases, leave and expenses that replace email chains</li>
  <li>Daily and weekly reports generated and shared without anyone building a spreadsheet</li>
  <li>Stock, order and dispatch updates synced between your store, warehouse and accounts</li>
</ul>

<h2>Estimate the payback before you build</h2>
<p>A simple calculation is enough to decide whether a workflow is worth automating:</p>
<ol>
  <li><strong>Time saved per month</strong> = minutes per task × tasks per month ÷ 60, giving hours.</li>
  <li><strong>Monthly saving</strong> = hours saved × the loaded hourly cost of the people doing it, plus any measurable cost of errors avoided.</li>
  <li><strong>Payback period</strong> = cost to build ÷ (monthly saving − monthly running cost).</li>
</ol>
<p>If the payback period is under three months, it is usually an easy decision. If it is over a year, look for a simpler version or a different workflow.</p>

<h2>Fix the process before you automate it</h2>
<p>Automating a messy process makes the mess faster. Before building, walk through the workflow with the people who do it, remove steps nobody needs, and agree the rules for exceptions. Often this alone saves a meaningful share of the effort.</p>

<h2>Keep people in charge of exceptions</h2>
<p>Good automation handles the routine cases and sends anything unusual to a person, with the context they need to decide quickly. It should also log what it did, so you can see and fix problems instead of discovering them at month end.</p>

<h2>Start small, then connect</h2>
<p>Begin with one workflow, measure the result against your estimate, and use that evidence to choose the next. Over time, connected automations across sales, finance and operations add up to far more than any single project.</p>`
  },

  {
    slug: "choosing-a-tech-stack",
    tag: "Engineering",
    title: "Choosing a tech stack you won't regret in three years",
    summary: "A practical framework for choosing frontend, backend, database and cloud technology that stays maintainable, affordable and easy to hire for.",
    date: "2026-11-09", read: 6,
    img: "1558494949-ef010cbdcc31", w: 1200, h: 673,
    alt: "Rows of servers in a data centre",
    related: [["Our Technology Stack", "../technologies.html"], ["Web Application Development", "../services/web-development.html"], ["Mobile App Development", "../services/mobile-development.html"]],
    body: `
<p class="article-lead">The technology behind a business application is a long-term commitment. A good choice fades into the background; a poor one shows up years later as slow delivery, hiring trouble and expensive rewrites.</p>

<h2>Ask these questions before comparing tools</h2>
<ol>
  <li><strong>What does the product need to do?</strong> A content website, a transaction-heavy ERP, a real-time dashboard and a mobile app have different needs.</li>
  <li><strong>Who will maintain it?</strong> If you have an in-house team, their existing skills matter more than any benchmark.</li>
  <li><strong>How big will it get?</strong> Plan for realistic growth over three years, not for a scale you may never reach.</li>
  <li><strong>What must it connect to?</strong> Payment gateways, accounting software, government portals and existing databases all have preferred integration methods.</li>
  <li><strong>What are the rules?</strong> Data residency, security standards and audit requirements can rule options in or out.</li>
</ol>

<h2>Prefer boring, well-supported technology</h2>
<p>Mature tools with long support lifecycles, large communities and plenty of available developers are usually the safest choice for business software. For example:</p>
<ul>
  <li><strong>Frontend</strong>: React or Angular for web applications; Flutter or native Android and iOS for mobile.</li>
  <li><strong>Backend</strong>: .NET, Node.js or Python, each with strong frameworks and long-term support releases.</li>
  <li><strong>Database</strong>: PostgreSQL or SQL Server for most business data; add specialised stores only when there is a clear need.</li>
  <li><strong>Cloud</strong>: AWS or Azure, using managed services to reduce the work of running servers.</li>
</ul>
<p>New tools can be excellent, but every unusual choice adds a hiring and maintenance cost. Use them where they give a clear advantage, not by default.</p>

<h2>Check the total cost, not just the licence</h2>
<p>Include hosting, monitoring, third-party services, developer salaries and the cost of upgrades over three years. A free framework that needs scarce specialists can cost more than a licensed product your team already knows.</p>

<h2>Avoid lock-in where it matters</h2>
<p>Some lock-in is fine if it saves real effort. Keep the most valuable parts portable: your data in standard formats, your business logic in your own code, and integrations behind clear APIs. That way you can change a vendor without rebuilding the business.</p>

<h2>Prove it with a small spike</h2>
<p>Before committing, build a thin slice of the riskiest feature with the proposed stack, for example the integration with your payment gateway or a report over real data volumes. A week of real code answers questions that months of debate cannot.</p>

<h2>A simple scoring sheet</h2>
<p>Score each option from 1 to 5 on: fit for the product, team skills, hiring market, maturity and support, integration needs, security and compliance, and three-year cost. Weight the criteria that matter most to your business. The highest score is rarely the newest option, and that is usually a good sign.</p>`
  }
];
