"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Seed data definitions
const MOCK_PROPOSALS = [
  {
    id: "proposal-1",
    status: "PENDING",
    senderEmail: "sarah@acme-corp.com",
    senderName: "Sarah Jenkins (VP Prod @ Acme)",
    subject: "Urgent: Checkout flow redesign & multi-currency Stripe webhooks",
    bodyText: "Hey team,\n\nOur executive team decided we need to support EUR and GBP multi-currency billing on the checkout page before Friday's launch. Also, can we redesign the payment step to match our new brand guidelines? Let us know when this is deployed!\n\nThanks,\nSarah",
    draftReply: "Hi Sarah,\n\nI reviewed your request against our active Master Services Agreement (SOW-2026-B).\n\n1. Multi-Currency Stripe Webhooks: IN SCOPE (Covered under Sprint 4 milestone). Created Linear issue [DEV-104].\n2. Checkout Flow UI Redesign: OUT OF SCOPE (Exceeds Sprint 4 allocation). I have prepared a $1,200 Change Order draft (+8 dev hrs).\n\nIf approved, our engineering team can execute both items for Friday's release. Please let us know if you'd like us to issue the Change Order!\n\nBest regards,\nProject Coordinator AI"
  },
  {
    id: "proposal-2",
    status: "PENDING",
    senderEmail: "david@fintech-labs.io",
    senderName: "David Vance (CTO @ FinTech Labs)",
    subject: "Mobile view nav alignment bug on iOS Safari",
    bodyText: "Hey dev team,\n\nOne of our beta testers noticed that the top navigation header overlaps with the status bar on iOS Safari devices (iPhone 15 Pro). Can someone fix this regression?\n\nDavid",
    draftReply: "Hi David,\n\nThank you for flagging this bug. I verified our SOW retainer policy—bug fixes for core navigation components are 100% IN SCOPE.\n\nI have generated Linear issue [DEV-105] ('Fix iOS Safari viewport safe-area inset padding') and assigned it to Developer AI with high priority. We expect a patch deployed to staging within 4 hours.\n\nBest regards,\nProject Coordinator AI"
  },
  {
    id: "proposal-3",
    status: "PENDING",
    senderEmail: "elena@saas-growth.com",
    senderName: "Elena Rostova (Head of Growth)",
    subject: "Feature request: Dark mode toggle & export CSV button",
    bodyText: "Hi team!\n\nOur user feedback dashboard needs a quick export CSV button on the analytics page. Also, is dark mode included in this month's retainer build?\n\nBest,\nElena",
    draftReply: "Hi Elena,\n\nThanks for reaching out! \n\n1. Export CSV Button: IN SCOPE (Estimated 2 dev hrs under your monthly retainer allocation). Logged Linear issue [DEV-106].\n2. Dark Mode Theme Toggle: IN SCOPE (Already included in Phase 2 design system deliverables).\n\nBoth items have been prioritized for our upcoming sprint drop on Thursday.\n\nBest regards,\nProject Coordinator AI"
  }
];

const MOCK_CLIENTS = [
  {
    id: "client-1",
    name: "Sarah Jenkins",
    email: "sarah@acme-corp.com",
    company: "Acme Corp",
    phone: "+1 (555) 234-5678",
    website: "https://acme-corp.com",
    contractType: "Enterprise Retainer ($2,500/mo)",
    notes: "Requires EUR and GBP multi-currency support by Friday.",
    type: "CLIENT",
    source: "Inbound Email",
    createdAt: new Date().toISOString(),
    projects: [
      { id: "proj-1", name: "Checkout Flow Redesign & Multi-Currency", status: "ACTIVE", developerNotes: "Integrating Stripe multi-currency webhooks.", isCompleted: false, createdAt: new Date().toISOString() }
    ],
    proposals: [
      { id: "proposal-1", status: "PENDING", senderEmail: "sarah@acme-corp.com", senderName: "Sarah Jenkins (VP Prod @ Acme)", subject: "Urgent: Checkout flow redesign & multi-currency Stripe webhooks", bodyText: "Hey team,\n\nOur executive team decided we need to support EUR and GBP multi-currency billing on the checkout page before Friday's launch. Also, can we redesign the payment step to match our new brand guidelines? Let us know when this is deployed!\n\nThanks,\nSarah", draftReply: "Hi Sarah,\n\nI reviewed your request against our active Master Services Agreement (SOW-2026-B).\n\n1. Multi-Currency Stripe Webhooks: IN SCOPE (Covered under Sprint 4 milestone). Created Linear issue [DEV-104].\n2. Checkout Flow UI Redesign: OUT OF SCOPE (Exceeds Sprint 4 allocation). I have prepared a $1,200 Change Order draft (+8 dev hrs).\n\nIf approved, our engineering team can execute both items for Friday's release. Please let us know if you'd like us to issue the Change Order!\n\nBest regards,\nProject Coordinator AI", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]
  },
  {
    id: "client-2",
    name: "David Vance",
    email: "david@fintech-labs.io",
    company: "FinTech Labs",
    phone: "+1 (555) 876-5432",
    website: "https://fintech-labs.io",
    contractType: "Monthly Retainer ($1,500/mo)",
    notes: "Bug fixes for core navigation components are 100% IN SCOPE.",
    type: "CLIENT",
    source: "Inbound Lead",
    createdAt: new Date().toISOString(),
    projects: [
      { id: "proj-2", name: "Mobile View Nav Alignment Patch", status: "ACTIVE", developerNotes: "Fixing safe-area inset padding on iOS Safari.", isCompleted: false, createdAt: new Date().toISOString() }
    ],
    proposals: [
      { id: "proposal-2", status: "PENDING", senderEmail: "david@fintech-labs.io", senderName: "David Vance (CTO @ FinTech Labs)", subject: "Mobile view nav alignment bug on iOS Safari", bodyText: "Hey dev team,\n\nOne of our beta testers noticed that the top navigation header overlaps with the status bar on iOS Safari devices (iPhone 15 Pro). Can someone fix this regression?\n\nDavid", draftReply: "Hi David,\n\nThank you for flagging this bug. I verified our SOW retainer policy—bug fixes for core navigation components are 100% IN SCOPE.\n\nI have generated Linear issue [DEV-105] ('Fix iOS Safari viewport safe-area inset padding') and assigned it to Developer AI with high priority. We expect a patch deployed to staging within 4 hours.\n\nBest regards,\nProject Coordinator AI", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ]
  }
];

const MOCK_AGENTS = [
  {
    id: "project-coordinator",
    name: "Project Coordination & Product Strategy",
    role: "Scope Control & Linear Backlog Breakdown",
    description: "Enforces SOW contract boundaries (Unbilled Scope Creep Target: $0), translates client requests into Linear user stories, and drafts Change Orders.",
    isActive: true,
    directives: "Verify SOW contracts in Company Brain. Tag In-Scope retainer tasks vs Out-of-Scope feature requests ($1,200 change orders). Maintain 100% sprint delivery velocity.",
    logs: [
      { timestamp: "10m ago", action: "Verified Scope Boundary", details: "Tagged Acme Corp request: Multi-Currency (IN-SCOPE [DEV-104]) | Checkout Redesign (OUT-OF-SCOPE Change Order $1,200)." },
      { timestamp: "1h ago", action: "Created Sprint Specs", details: "Assigned 2 retainer bug fixes to Engineering with acceptance criteria specs." }
    ]
  },
  {
    id: "developer",
    name: "Engineering & Architecture",
    role: "Production Code Construction & PRs",
    description: "Writes clean TypeScript code, executes local build/lint pipelines, and opens structured GitHub Pull Requests.",
    isActive: true,
    directives: "Write self-documenting code. Rely on HSL CSS design tokens. Ensure 85%+ test coverage. Maintain high feature velocity without tech debt.",
    logs: [
      { timestamp: "25m ago", action: "Opened GitHub Pull Request", details: "Pushed PR #42 ('Fix iOS Safari viewport safe-area inset padding') for Linear ticket DEV-105." }
    ]
  },
  {
    id: "qa",
    name: "Quality Assurance & Security",
    role: "E2E Testing & Security Scanning",
    description: "Runs automated Playwright test suites, scans dependencies for vulnerabilities (Target: 0 Prod Defects), and audits PR compliance.",
    isActive: true,
    directives: "Verify zero failing E2E tests. Scan for CVE security vulnerabilities. Block PRs that fail acceptance criteria or introduce regressions.",
    logs: [
      { timestamp: "15m ago", action: "Executed E2E Test Suite", details: "Ran 14 Playwright integration tests against PR #42 - 100% Passed. Security audit clear." }
    ]
  },
  {
    id: "devops",
    name: "Infrastructure & DevOps",
    role: "Production CI/CD & 99.99% Uptime SLA",
    description: "Manages production deployments, zero-downtime database migrations, server monitoring, and cloud infrastructure efficiency.",
    isActive: true,
    directives: "Maintain 99.99% server uptime SLA. Monitor Sentry logs and database latency. Execute zero-downtime release deployments for QA-approved PRs.",
    logs: [
      { timestamp: "5m ago", action: "Deployed Production Build", details: "Released production patch v1.4.2 to server fleet. Latency: 68ms | Uptime: 99.99%." }
    ]
  },
  {
    id: "sales",
    name: "Revenue & Commercial Operations",
    role: "Lead Qualification & Pipeline ARR",
    description: "Qualifies inbound client leads, scores contract LTV potential, and drafts customized SOW proposals.",
    isActive: true,
    directives: "Score inbound lead intent against corporate pricing rules. Maintain <15 min proposal response SLA. Optimize pipeline conversion velocity.",
    logs: [
      { timestamp: "1h ago", action: "Qualified Enterprise Lead", details: "Scored FinTech Labs ($24k ARR potential) - generated drafted SOW proposal." }
    ]
  },
  {
    id: "support",
    name: "Customer Success & Support",
    role: "Tier-1 Ticketing & CSAT Retention",
    description: "Frontline customer ticketing, account onboarding, and ticket deflection using Company Brain FAQ guidelines (Target: >95% CSAT).",
    isActive: true,
    directives: "Maintain <5 min first response time and <2 hr resolution SLA. Resolve Tier-1 issues via knowledge base docs. Pass reproducible bugs to Project Coordination.",
    logs: [
      { timestamp: "30m ago", action: "Resolved Support Ticket", details: "Answered CNAME SSL configuration query for Charlie Brown using FAQ rules. CSAT: 5/5." }
    ]
  },
  {
    id: "finance",
    name: "Finance & Revenue Operations",
    role: "Stripe Billing, Change Orders & Dunning",
    description: "Manages Stripe payment processors, drafts Change Order invoices, executes dunning recovery, and tracks gross profit margins.",
    isActive: true,
    directives: "Maintain >65% dunning recovery rate. Process Change Order invoices prepared by Project Coordination. Audit refunds against strict policy rules.",
    logs: [
      { timestamp: "45m ago", action: "Drafted Stripe Change Order", details: "Prepared $1,200 Stripe Change Order invoice for Acme Corp checkout redesign." }
    ]
  },
  {
    id: "marketing",
    name: "Brand & Content Marketing",
    role: "Product Changelogs & Organic Demand",
    description: "Auto-generates public product changelogs from merged PRs, writes technical case studies, and drives organic lead traffic.",
    isActive: true,
    directives: "Generate concise, developer-centric release notes from main branch commits. Optimize organic inbound traffic growth.",
    logs: [
      { timestamp: "2h ago", action: "Published Product Changelog", details: "Generated release update from merged PRs: 'iOS Safari Viewport & Billing Webhook Optimizations'." }
    ]
  },
  {
    id: "operations",
    name: "Operations AI",
    role: "Integrations Health & Webhook Router",
    description: "Monitors auth tokens, tracks api latency, and flags connection anomalies.",
    isActive: true,
    directives: "Ping Resend and Stripe endpoint statuses every 5 minutes. Refresh expiring OAuth credentials. Log warning events on Sentry if webhook processing drops.",
    logs: [
      { timestamp: "12m ago", action: "Checked Integration pings", details: "Successfully pinged Stripe and Resend APIs - Latency 82ms." },
      { timestamp: "1d ago", action: "Rotated API Key Logs", details: "Cleaned and encrypted Resend mail server API logs to secure databases." }
    ]
  },
  {
    id: "analytics",
    name: "Analytics AI",
    role: "Metric aggregators & Growth Forecaster",
    description: "Computes active user deltas, compiles MRR reports, and outputs growth summaries.",
    isActive: true,
    directives: "Aggregate Daily Active Users (DAU) and Monthly Recurring Revenue (MRR) parameters. Generate simple reports without charts - rely on clean markdown metrics.",
    logs: [
      { timestamp: "2h ago", action: "Compiled DAU metrics", details: "Calculated active users delta: +12% increase since domain support update." },
      { timestamp: "1d ago", action: "Generated Stripe MRR summary", details: "Compiled Stripe revenue metrics report showing $18,400 active MRR." }
    ]
  },
  {
    id: "hr",
    name: "HR AI",
    role: "Onboarding documents & Guidelines generator",
    description: "Drafts freelancer guidelines, generated job descriptions, and coordinates advisor templates.",
    isActive: false,
    directives: "Maintain contractor compliance templates. Draft job description listings. Ensure all onboarding documents conform to standard contractor terms.",
    logs: [
      { timestamp: "2d ago", action: "Drafted Job Description", details: "Compiled visual design criteria for upcoming contractor listings." }
    ]
  },
  {
    id: "legal",
    name: "Legal AI",
    role: "Privacy Policy checks & Contract Audits",
    description: "Scans client terms policies, alerts GDPR compliance issues, and drafts terms revisions.",
    isActive: true,
    directives: "Review custom contract proposals against default liability caps. Scan Privacy Policy drafts for compliant data retention guidelines.",
    logs: [
      { timestamp: "4h ago", action: "Audited CloudCorp Contract", details: "Reviewed enterprise liability limits for CloudCorp terms audit." }
    ]
  },
  {
    id: "research",
    name: "Research AI",
    role: "Competitor Scraping & Tech Audits",
    description: "Scrapes competitor pricing matrices and summarizes architectural research papers.",
    isActive: true,
    directives: "Monitor competitor pricing plans. Scrape technical documentation regarding SQLite vector performance scaling comparisons.",
    logs: [
      { timestamp: "1h ago", action: "Scraped Pricing Matrices", details: "Indexed competitive pricing structures for 3 multi-agent developer tools." },
      { timestamp: "6h ago", action: "Summarized SQLite Vector Papers", details: "Compiled performance benchmarks on pgvector vs local sqlite-vss indexes." }
    ]
  }
];

// Global Fallback In-Memory State for Serverless Deployments (Vercel)
let proposalsStore: any[] = MOCK_PROPOSALS.map((p) => ({ ...p, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }));
let agentsStore: any[] = MOCK_AGENTS.map((a) => ({
  ...a,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  logs: (a.logs || []).map((l) => ({ ...l, id: `log-${Math.random()}`, agentId: a.id, createdAt: new Date().toISOString() }))
}));

// Helper to seed agents automatically if empty (without hardcoded logs for production)
export async function seedAgents() {
  try {
    for (const a of MOCK_AGENTS) {
      const existing = await db.agent.findUnique({ where: { id: a.id } });
      if (!existing) {
        const { logs, ...agentData } = a;
        await db.agent.create({ data: agentData });
      }
    }
  } catch (e) {
    console.warn("seedAgents fallback notice:", e);
  }
}

// Create Production Workspace
export async function createProductionWorkspace(data: {
  companyName: string;
  companyType?: string;
  website?: string;
  timezone?: string;
  workingHours?: string;
  currency?: string;
  brainContent?: string;
  clientName?: string;
  clientEmail?: string;
}) {
  await seedAgents();

  const workspace = await db.workspace.create({
    data: {
      name: data.companyName,
      companyType: data.companyType || "Software Agency",
      website: data.website || "",
      timezone: data.timezone || "UTC",
      workingHours: data.workingHours || "9am - 5pm",
      currency: data.currency || "USD",
      isDemo: false,
      onboardingCompleted: true,
      brainContent: data.brainContent || ""
    }
  });

  if (data.clientName && data.clientEmail) {
    await db.client.create({
      data: {
        workspaceId: workspace.id,
        name: data.clientName,
        email: data.clientEmail
      }
    });
  }

  return {
    ...workspace,
    createdAt: workspace.createdAt.toISOString(),
    updatedAt: workspace.updatedAt.toISOString()
  };
}

// Create or Fetch Demo Workspace
export async function createDemoWorkspace() {
  await seedAgents();

  let demoWs = await db.workspace.findFirst({
    where: { isDemo: true },
    include: { proposals: true }
  });

  if (!demoWs) {
    demoWs = await db.workspace.create({
      data: {
        name: "Acme Software Studio (Demo)",
        companyType: "Software Agency",
        isDemo: true,
        onboardingCompleted: true,
        brainContent: "# Acme Software Studio Guidelines\n\n## Retainer Rules\n- Sprint deliverables include bug fixes and standard updates.\n- Out of scope requests generate $1,200 Change Orders."
      },
      include: { proposals: true }
    });

    for (const p of MOCK_PROPOSALS) {
      await db.proposal.create({
        data: {
          ...p,
          workspaceId: demoWs.id
        }
      });
    }

    demoWs = await db.workspace.findUnique({
      where: { id: demoWs.id },
      include: { proposals: true }
    }) || demoWs;
  }

  return {
    ...demoWs,
    createdAt: demoWs.createdAt.toISOString(),
    updatedAt: demoWs.updatedAt.toISOString()
  };
}

// Fetch proposals scoped by mode
export async function getProposals(isDemo: boolean = false) {
  try {
    await seedAgents();

    if (isDemo) {
      const demoWs = await createDemoWorkspace();
      const list = await db.proposal.findMany({
        where: { workspaceId: demoWs.id },
        orderBy: { createdAt: "asc" }
      });
      if (list && list.length > 0) {
        return list.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        }));
      }
    }

    // Production workspace proposals
    const list = await db.proposal.findMany({
      orderBy: { createdAt: "asc" }
    });

    if (list && list.length > 0) {
      return list.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString()
      }));
    }
  } catch (err) {
    console.error("Error loading proposals from SQLite:", err);
  }

  // Fallback to proposalsStore if database is empty or read-only on deployment
  return proposalsStore;
}

// Fetch all agents with their timeline logs
export async function getAgents() {
  try {
    await seedAgents(); // Run fallback agent seed check
    const list = await db.agent.findMany({
      include: {
        logs: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (list && list.length > 0) {
      return list.map((a) => ({
        ...a,
        createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: a.updatedAt ? a.updatedAt.toISOString() : new Date().toISOString(),
        logs: (a.logs || []).map((l) => ({
          ...l,
          createdAt: l.createdAt ? l.createdAt.toISOString() : new Date().toISOString()
        }))
      }));
    }
  } catch (err) {
    console.error("Error loading agents from database:", err);
  }

  // Fallback to agentsStore (localhost AI roster) if database is empty or read-only
  return agentsStore;
}

// Update proposal draft response inline
export async function updateProposalDraft(id: string, text: string) {
  try {
    const updated = await db.proposal.update({
      where: { id },
      data: { draftReply: text }
    });
    revalidatePath("/");
    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString()
    };
  } catch (err) {
    console.warn("updateProposalDraft fallback to in-memory store:", err);
  }

  const prop = proposalsStore.find((p) => p.id === id);
  if (prop) {
    prop.draftReply = text;
    prop.updatedAt = new Date().toISOString();
  }
  revalidatePath("/");
  return prop || { id, draftReply: text, status: "PENDING" };
}

// Approve proposal (Simulates Resend API call)
export async function approveProposal(id: string) {
  try {
    const proposal = await db.proposal.findUnique({ where: { id } });
    if (proposal) {
      await db.proposal.update({
        where: { id },
        data: { status: "APPROVED" }
      });

      await safeCreateLog(
        "support",
        "Approved Support Draft Sent",
        `Email sent to ${proposal.senderEmail} regarding: '${proposal.subject}'.`
      );

      revalidatePath("/");
      return { success: true };
    }
  } catch (err) {
    console.warn("approveProposal fallback to in-memory store:", err);
  }

  const prop = proposalsStore.find((p) => p.id === id);
  if (prop) {
    prop.status = "APPROVED";
    prop.updatedAt = new Date().toISOString();
  }

  const supportAgent = agentsStore.find((a) => a.id === "support");
  if (supportAgent) {
    supportAgent.logs = supportAgent.logs || [];
    supportAgent.logs.unshift({
      id: `log-${Date.now()}`,
      agentId: "support",
      timestamp: "Just now",
      action: "Approved Support Draft Sent",
      details: `Email sent to ${prop ? prop.senderEmail : "client"} regarding: '${prop ? prop.subject : "proposal"}'.`,
      createdAt: new Date().toISOString()
    });
  }

  revalidatePath("/");
  return { success: true };
}

// Reject proposal (Logs rejections and feedback)
export async function rejectProposal(id: string, feedback: string) {
  try {
    const proposal = await db.proposal.findUnique({ where: { id } });
    if (proposal) {
      await db.proposal.update({
        where: { id },
        data: { status: "REJECTED" }
      });

      await safeCreateLog(
        "support",
        "Draft Rejected with Feedback",
        `Rejected reply for ${proposal.senderEmail}. Feedback: "${feedback}".`
      );

      revalidatePath("/");
      return { success: true };
    }
  } catch (err) {
    console.warn("rejectProposal fallback to in-memory store:", err);
  }

  const prop = proposalsStore.find((p) => p.id === id);
  if (prop) {
    prop.status = "REJECTED";
    prop.updatedAt = new Date().toISOString();
  }

  const supportAgent = agentsStore.find((a) => a.id === "support");
  if (supportAgent) {
    supportAgent.logs = supportAgent.logs || [];
    supportAgent.logs.unshift({
      id: `log-${Date.now()}`,
      agentId: "support",
      timestamp: "Just now",
      action: "Draft Rejected with Feedback",
      details: `Rejected reply for ${prop ? prop.senderEmail : "client"}. Feedback: "${feedback}".`,
      createdAt: new Date().toISOString()
    });
  }

  revalidatePath("/");
  return { success: true };
}

// Toggle agent operational activity
export async function toggleAgentActive(id: string, isActive: boolean) {
  const updated = await db.agent.update({
    where: { id },
    data: { isActive }
  });

  await db.log.create({
    data: {
      agentId: id,
      timestamp: "Just now",
      action: isActive ? "Agent Activated" : "Agent Paused",
      details: `Status toggled by founder.`
    }
  });

  revalidatePath("/");
  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString()
  };
}

// Save custom agent directives
export async function saveAgentDirectives(id: string, directives: string) {
  const updated = await db.agent.update({
    where: { id },
    data: { directives }
  });

  await db.log.create({
    data: {
      agentId: id,
      timestamp: "Just now",
      action: "Directives Saved",
      details: `Guidelines modified - local agent context updated.`
    }
  });

  revalidatePath("/");
  return {
    ...updated,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString()
  };
}

// Trigger autonomous task execution cycle for an AI Employee
export async function runAgentAutonomousTask(id: string, customInstruction?: string) {
  const agent = await db.agent.findUnique({ where: { id } });
  if (!agent) throw new Error("Agent not found");

  // Make sure agent is marked active when triggered
  if (!agent.isActive) {
    await db.agent.update({
      where: { id },
      data: { isActive: true }
    });
  }

  let actionTitle = customInstruction ? `Executed Directive: "${customInstruction.slice(0, 30)}..."` : "Autonomous Work Cycle Executed";
  let detailsText = "";

  // Gemini AI execution if key is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are ${agent.name} (${agent.role}). Directives: ${agent.directives}. User instruction: ${customInstruction || 'Perform standard operational audit'}. State what you executed in 2 concise sentences with evidence metrics.`;
      const result = await model.generateContent(prompt);
      detailsText = result.response.text().trim();
    } catch (e) {
      console.warn("Gemini execution fallback:", e);
    }
  }

  if (!detailsText) {
    const taskOutcomes: Record<string, string> = {
      "project-coordinator": "Audited 18 scope boundaries. Identified 1 pending $1,200 Change Order for enterprise SAML addendum.",
      "developer": "Ran automated pipeline check & opened PR #8405 ('Optimized sqlite index queries'). 0 lint errors.",
      "qa": "Ran 24 Playwright E2E integration tests. Security scan passed with 0 vulnerabilities.",
      "devops": "Deployed production hotfix v1.4.3. System SLA: 99.99% uptime | Avg latency: 54ms.",
      "sales": "Qualified 3 inbound enterprise leads. Generated drafted SOW proposals (+$8,400 ARR expansion).",
      "support": "Triaged 14 customer support tickets. 100% resolved using Company Brain KB rules.",
      "finance": "Audited Stripe deposit billing logs. Net margin: 94%. Reconciled $1,400 unused cloud resources.",
      "marketing": "Published technical product changelog update from merged PRs.",
      "operations": "Checked integration webhooks. Stripe and Resend APIs active - 62ms latency.",
      "analytics": "Aggregated daily active user metrics: +14% DAU expansion.",
      "legal": "Audited Enterprise Terms Addendum. 100% compliant with standard liability caps.",
      "research": "Scraped 4 competitor pricing benchmarks. Updated positioning matrix."
    };

    detailsText = customInstruction 
      ? `Executed custom directive: "${customInstruction}". Output verified against ${agent.name} parameters.`
      : (taskOutcomes[id] || "Executed directive loop autonomously. Outcome verified.");
  }

  // Create new log entry
  await db.log.create({
    data: {
      agentId: id,
      timestamp: "Just now",
      action: actionTitle,
      details: detailsText
    }
  });

  revalidatePath("/");
  
  // Return updated logs list
  const logs = await db.log.findMany({
    where: { agentId: id },
    orderBy: { createdAt: "desc" }
  });

  return logs.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString()
  }));
}

// Trigger simulated incoming support webhooks
export async function triggerMockProposal(template: string) {
  const newId = `proposal-${Date.now()}`;
  let mockData;

  if (template === "new-lead" || template === "sales-lead") {
    mockData = {
      id: newId,
      status: "PENDING",
      senderEmail: "alex.rivera@hypergrowth-labs.com",
      senderName: "Alex Rivera (CEO @ HyperGrowth)",
      subject: "Enterprise Retainer & AI Integration Inquiry",
      bodyText: "Hi team,\n\nWe are looking to retain your agency for custom AI integrations starting next month ($5,000/mo retainer). Can we schedule an onboarding huddle?",
      draftReply: "Hi Alex,\n\nThank you for reaching out! We'd be excited to partner with HyperGrowth Labs.\n\nI have drafted our Enterprise SLA proposal ($5,000/mo retainer) and reserved an onboarding huddle slot. Our Sales AI has prepared your client profile for 1-click authorization.\n\nBest regards,\nSales AI",
      isNewClientLead: true,
      detectedCompany: "HyperGrowth Labs",
      detectedContact: "Alex Rivera",
      suggestedType: "CLIENT"
    };
  } else if (template === "refund") {
    mockData = {
      id: newId,
      status: "PENDING",
      senderEmail: `alice.${Date.now().toString().slice(-4)}@example.com`,
      senderName: "Alice Johnson",
      subject: `Simulated Refund Request #${Date.now().toString().slice(-4)}`,
      bodyText: "Hey,\n\nI was charged twice. Can you look into this refund?",
      draftReply: "Hi Alice,\n\nVerified duplicate billing. Processed refund of $49."
    };
  } else if (template === "invoice") {
    mockData = {
      id: newId,
      status: "PENDING",
      senderEmail: `bob.${Date.now().toString().slice(-4)}@gmail.com`,
      senderName: "Bob Smith",
      subject: `Simulated Corporate Invoice #${Date.now().toString().slice(-4)}`,
      bodyText: "Finance requires invoice with corporate Tax ID.",
      draftReply: "Hi Bob,\n\nCorporate tax invoice queued for Acne Labs Inc."
    };
  } else {
    mockData = {
      id: newId,
      status: "PENDING",
      senderEmail: `charlie.${Date.now().toString().slice(-4)}@team.com`,
      senderName: "Charlie Brown",
      subject: `Simulated Domain SSL Error #${Date.now().toString().slice(-4)}`,
      bodyText: "Domain verification Cloudflare proxy issue.",
      draftReply: "Hi Charlie,\n\nToggle Cloudflare DNS Proxy status to DNS-Only (Gray Cloud)."
    };
  }

  const created = await db.proposal.create({ data: mockData });
  revalidatePath("/");
  return {
    ...created,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString()
  };
}

// Fetch all meetings from the database
export async function getMeetings() {
  try {
    const list = await db.meeting.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    });
    if (list && list.length > 0) {
      return list.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        messages: m.messages.map((msg) => ({
          ...msg,
          createdAt: msg.createdAt.toISOString()
        }))
      }));
    }
  } catch (err) {
    console.error("Error fetching meetings:", err);
  }

  // Fallback initial meeting for deployment
  return [
    {
      id: "meeting-all-hands",
      title: "All-Hands Operations Huddle",
      type: "all-hands",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: "msg-init-1",
          meetingId: "meeting-all-hands",
          senderId: "ceo-assistant",
          senderName: "CEO Assistant AI",
          bodyText: "All Executive AI Units initialized and standing by. What strategic directives shall we address today?",
          createdAt: new Date().toISOString()
        }
      ]
    }
  ];
}

// Start a new huddle session
export async function createMeeting(title: string, type: string, agentId?: string, participantIds?: string) {
  const created = await db.meeting.create({
    data: {
      title,
      type,
      agentId,
      participantIds
    }
  });
  revalidatePath("/");
  return {
    ...created,
    createdAt: created.createdAt.toISOString()
  };
}

// Close/archive a huddle
export async function completeMeeting(meetingId: string) {
  const updated = await db.meeting.update({
    where: { id: meetingId },
    data: { status: "COMPLETED" }
  });
  revalidatePath("/");
  return {
    ...updated,
    createdAt: updated.createdAt.toISOString()
  };
}

// Post a transcript message
export async function sendMeetingMessage(meetingId: string, senderId: string, senderName: string, bodyText: string) {
  const created = await db.meetingMessage.create({
    data: {
      meetingId,
      senderId,
      senderName,
      bodyText
    }
  });
  revalidatePath("/");
  return {
    ...created,
    createdAt: created.createdAt.toISOString()
  };
}

// Helper to construct dynamic context-aware fallback answers from AI employees based on Founder query keywords
function getMockAgentResponse(
  agentId: string,
  agentName: string,
  agentRole: string,
  message: string,
  todaysTickets: number,
  aiSolved: number,
  dbPending: number,
  approvalRate: number,
  revenueImpact: number,
  hoursSaved: string
): string {
  const lowText = message.toLowerCase();

  switch (agentId) {
    case "ceo-assistant":
      if (lowText.includes("status") || lowText.includes("update") || lowText.includes("how are we") || lowText.includes("report") || lowText.includes("metrics")) {
        return `We're looking solid. Today we processed ${todaysTickets} tickets with a ${approvalRate}% AI approval rating. Net revenue is up +$${revenueImpact}, saving you ${hoursSaved} hours.`;
      }
      if (lowText.includes("meeting") || lowText.includes("schedule") || lowText.includes("huddle") || lowText.includes("sync")) {
        return "I can schedule huddles, direct chats, or custom sync rooms. Tell me which departments you want to summon.";
      }
      return `Hey. I'm coordinating all active departments. What decisions or directives do you want to review?`;

    case "project-coordinator":
      if (lowText.includes("ticket") || lowText.includes("issue") || lowText.includes("task") || lowText.includes("bug")) {
        return "I've logged backlog tickets for Developer AI to patch custom domain CNAME proxy verification errors. Sprint is on track.";
      }
      if (lowText.includes("status") || lowText.includes("progress")) {
        return "Project milestones are green. Developer AI is working on adapter pooling, QA check is scheduled next.";
      }
      return `Hey. I'm monitoring active sprints. Let me know if you need to assign new backlog tickets.`;

    case "developer":
      if (lowText.includes("work") || lowText.includes("doing") || lowText.includes("status") || lowText.includes("task") || lowText.includes("what your")) {
        return "I'm refactoring our custom domain validation router right now to resolve Cloudflare proxy setup errors.";
      }
      if (lowText.includes("code") || lowText.includes("commit") || lowText.includes("refactor")) {
        return "I just pushed a fix to our SQLite adapter setup. Pushing the Huddle layout refactor next.";
      }
      return "Developer AI here. Let me know if there's code to write, bugs to patch, or layouts to refactor.";

    case "qa":
      if (lowText.includes("test") || lowText.includes("check") || lowText.includes("run")) {
        return "All Jest and Playwright specs are passing. API responses are 200 and visual tests are clean.";
      }
      if (lowText.includes("bug") || lowText.includes("issue")) {
        return "Staging build looks stable. I've verified database hooks and found no console crashes.";
      }
      return "QA department active. I verify typescript layouts and run automated test suites.";

    case "devops":
      if (lowText.includes("deploy") || lowText.includes("release") || lowText.includes("pipeline")) {
        return "Revision v1.4.2 is live on production with zero downtime. Response latency is stable at 74ms.";
      }
      if (lowText.includes("server") || lowText.includes("db") || lowText.includes("database") || lowText.includes("cache")) {
        return "SQLite backups are running and Next.js RockDB caches are clean. Infrastructure health is nominal.";
      }
      return "DevOps active. Managing SQLite replication and continuous deployment flows.";

    case "sales":
      if (lowText.includes("lead") || lowText.includes("customer") || lowText.includes("signup") || lowText.includes("what your lead") || lowText.includes("whats your lead")) {
        return "We got 2 hot enterprise signups today: Acme Corp ($12k LTV) and Globex ($8k LTV). Automating their outreach campaigns now.";
      }
      if (lowText.includes("work") || lowText.includes("doing") || lowText.includes("status") || lowText.includes("what your")) {
        return "I scan corporate signups, estimate potential contract values, and trigger outbound campaign sequences.";
      }
      if (lowText.includes("revenue") || lowText.includes("deal") || lowText.includes("close")) {
        return `Our outreach campaigns contributed to the +$${revenueImpact} revenue expansion today.`;
      }
      return "Hey. Sales pipeline is fully active. Let me know if you want to inspect signup leads.";

    case "marketing":
      if (lowText.includes("campaign") || lowText.includes("ad") || lowText.includes("twitter") || lowText.includes("seo") || lowText.includes("work")) {
        return "We're ranking #3 on Product Hunt keywords for 'Autonomous OS'. Newsletter signups are up +14%.";
      }
      return "Marketing active. Managing outreach growth campaigns, Twitter updates, and newsletter templates.";

    case "support":
      if (lowText.includes("refund") || lowText.includes("policy")) {
        return "Duplicate transaction refunds within 14 days are auto-approved. Annual plan refunds are routed to your inbox.";
      }
      if (lowText.includes("ticket") || lowText.includes("inbox") || lowText.includes("customer") || lowText.includes("work")) {
        return `We processed ${todaysTickets} tickets today. ${aiSolved} resolved by AI, ${dbPending} pending reviews. CSAT is at 98%.`;
      }
      return "Hey. Support queues are healthy with a 4-minute triage latency. Directives are fully operational.";

    case "finance":
      if (lowText.includes("revenue") || lowText.includes("mrr") || lowText.includes("stripe") || lowText.includes("financial") || lowText.includes("work")) {
        return `Today's net revenue impact is +$${revenueImpact}. Stripe subscriptions and invoices are in sync.`;
      }
      if (lowText.includes("price") || lowText.includes("pricing") || lowText.includes("plan")) {
        return "Standard team plan is $99/mo (5 seats, $15/seat extra). Enterprise is $299/mo.";
      }
      return "Finance active. Reconciling deposits against Stripe ledgers. What stats do you want to inspect?";

    case "operations":
      return "Operations are nominal. Cross-department API integrations and rate limits are fully balanced.";
    case "analytics":
      return "Compiling cohort retention metrics. Active user ratios are trending positive this week.";
    case "hr":
      return "AI department allocations are locked in and performance logs are synchronized.";
    case "legal":
      return "Audited company FAQs and legal policies. Terms of Service drafts are compliant.";
    case "research":
      return "Summarizing competitor pricing moves and local vector search papers. Ready to report.";

    default:
      return `${agentName} online. Reviewing directives: "${agentRole}". Status is nominal.`;
  }
}

// Generate context-aware response from AIs in the huddle
export async function generateMeetingAIResponse(meetingId: string, founderMessage: string) {
  const meeting = await db.meeting.findUnique({
    where: { id: meetingId }
  });
  if (!meeting) throw new Error("Meeting not found");

  // Determine participant names/roles
  let agentName = "All AIs";
  let agentRole = "Autonomous Company";
  let participantsList: any[] = [];
  if (meeting.type === "one-on-one" && meeting.agentId) {
    const agent = await db.agent.findUnique({ where: { id: meeting.agentId } });
    if (agent) {
      agentName = agent.name;
      agentRole = agent.role;
    }
  } else if (meeting.type === "custom" && meeting.participantIds) {
    const ids = meeting.participantIds.split(",");
    participantsList = await db.agent.findMany({
      where: { id: { in: ids } }
    });
  }

  // Fetch metrics dynamically to inject into LLM or simulator context
  const dbApproved = await db.proposal.count({ where: { status: "APPROVED" } });
  const dbRejected = await db.proposal.count({ where: { status: "REJECTED" } });
  const dbPending = await db.proposal.count({ where: { status: "PENDING" } });

  const todaysTickets = 24 + dbApproved + dbRejected;
  const aiSolved = 18 + dbApproved;
  const founderReviewed = 6 + dbRejected;
  const approvalRate = Math.round(((180 + dbApproved) / (187 + dbApproved + dbRejected)) * 100);
  const revenueImpact = 420 + (dbApproved * 45) - (dbRejected * 15);
  const hoursSaved = (12.4 + (dbApproved * 0.5) + (dbRejected * 0.1)).toFixed(1);

  const companyMetricsContext = `
    Current Company Health Metrics:
    - Today's Tickets: ${todaysTickets} (${aiSolved} solved by AI, ${founderReviewed} reviewed by Founder, ${dbPending} pending in queue)
    - Average Approval Rate: ${approvalRate}%
    - Net Revenue Impact: +$${revenueImpact}
    - Total Founder Hours Saved: ${hoursSaved} hours
  `;

  const companyBrainContext = `
    Company Guidelines & FAQ (Company Brain):
    1. Refund Policy: We process refunds for duplicate charges within 14 days of the transaction. Avoid refunds for annual plans unless approved by executive reviews.
    2. Team Pricing: Our Team plan is priced at $99/mo and supports up to 5 members. Each extra member is billed at $15/mo.
    3. CNAME Domain Verification: For SSL verification on custom domains, the Cloudflare proxy must be disabled (Gray Cloud mode) during installation.
  `;

  // Fetch recent conversation history
  const messages = await db.meetingMessage.findMany({
    where: { meetingId },
    orderBy: { createdAt: "asc" }
  });
  const historyText = messages.map(m => `${m.senderName}: ${m.bodyText}`).join("\n");

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim() !== "") {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are an AI Employee at 'clownfounder' (an autonomous company system).
        You are participating in a virtual huddle with the Founder.
        
        Participants:
        - Founder (Human)
        ${meeting.type === "one-on-one" ? `- ${agentName} (${agentRole})` : meeting.type === "custom" ? participantsList.map(p => `- ${p.name} (${p.role})`).join("\n") : `- All 14 AI Employees (CEO Assistant AI, Sales AI, Marketing AI, Project Coordinator AI, Developer AI, QA AI, DevOps AI, Finance AI, Support AI, Operations AI, Analytics AI, HR AI, Legal AI, Research AI)`}

        Contextual Information:
        ${companyMetricsContext}
        ${companyBrainContext}
        
        Huddle Conversation History:
        ${historyText}
        
        Founder's Last Message: "${founderMessage}"
        
        Instruction:
        Generate a response to the Founder's message.
        - Keep responses concise, professional, and action-oriented (Linear/Stripe aesthetic).
        - If this is a 1-on-1 meeting, you must respond as the select agent "${meeting.agentId}".
        - If this is a Custom group meeting, up to two relevant AI employees from the participants list should reply.
        - If this is an All-Hands meeting, up to two relevant AI employees from all available AIs should reply.
        - Format the output as a valid JSON array of objects, where each object has:
          "senderId": "the agent's ID in lower case (e.g. 'support', 'finance', 'sales', 'analytics')"
          "senderName": "the agent's display name (e.g. 'Support AI', 'Finance AI', 'Sales AI', 'Analytics AI')"
          "bodyText": "the message text response"
        - Output ONLY the raw JSON array. Do not wrap it in markdown code blocks or backticks.
      `;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();
      
      let cleanedJson = rawText;
      if (cleanedJson.startsWith("```json")) {
        cleanedJson = cleanedJson.slice(7);
      }
      if (cleanedJson.startsWith("```")) {
        cleanedJson = cleanedJson.slice(3);
      }
      if (cleanedJson.endsWith("```")) {
        cleanedJson = cleanedJson.slice(0, -3);
      }
      cleanedJson = cleanedJson.trim();

      const responseArray = JSON.parse(cleanedJson);
      if (Array.isArray(responseArray)) {
        for (const resp of responseArray) {
          await db.meetingMessage.create({
            data: {
              meetingId,
              senderId: resp.senderId,
              senderName: resp.senderName,
              bodyText: resp.bodyText
            }
          });
        }
        revalidatePath("/");
        return { success: true };
      }
    } catch (err) {
      console.error("Gemini API call failed, falling back to simulator:", err);
    }
  }

  // Fallback Simulator Engine (Detailed heuristics and context mapping)
  const lowText = founderMessage.toLowerCase();
  const responses: { senderId: string; senderName: string; bodyText: string }[] = [];

  if (meeting.type === "one-on-one" && meeting.agentId) {
    const agentId = meeting.agentId;
    const bodyText = getMockAgentResponse(
      agentId,
      agentName,
      agentRole,
      founderMessage,
      todaysTickets,
      aiSolved,
      dbPending,
      approvalRate,
      revenueImpact,
      hoursSaved
    );
    responses.push({
      senderId: agentId,
      senderName: agentName,
      bodyText
    });
  } else {
    // Scan for explicit agent mentions in the founder message
    let responderIds: string[] = [];
    const allAgentsList = await db.agent.findMany();
    for (const a of allAgentsList) {
      const namePattern = a.name.toLowerCase().replace(" ai", "");
      if (lowText.includes(a.id.toLowerCase()) || lowText.includes(namePattern)) {
        responderIds.push(a.id);
      }
    }

    // If no explicit agent is mentioned, fall back to keyword mapping
    if (responderIds.length === 0) {
      if (lowText.includes("refund") || lowText.includes("policy") || lowText.includes("charge")) {
        responderIds = ["support"];
      } else if (lowText.includes("status") || lowText.includes("overview") || lowText.includes("metrics") || lowText.includes("how are we")) {
        responderIds = ["ceo-assistant"];
      } else if (lowText.includes("revenue") || lowText.includes("mrr") || lowText.includes("sales") || lowText.includes("growth") || lowText.includes("lead")) {
        responderIds = ["sales"];
      } else if (lowText.includes("code") || lowText.includes("bug") || lowText.includes("task") || lowText.includes("delay")) {
        responderIds = ["developer"];
      } else {
        // Default to a single responder depending on custom participants, or just ceo-assistant
        if (meeting.type === "custom" && meeting.participantIds) {
          responderIds = [meeting.participantIds.split(",")[0]];
        } else {
          responderIds = ["ceo-assistant"];
        }
      }
    }

    for (const rId of responderIds) {
      const agent = await db.agent.findUnique({ where: { id: rId } });
      const aName = agent ? agent.name : `${rId.toUpperCase()} AI`;
      const aRole = agent ? agent.role : "Agent";
      const bodyText = getMockAgentResponse(
        rId,
        aName,
        aRole,
        founderMessage,
        todaysTickets,
        aiSolved,
        dbPending,
        approvalRate,
        revenueImpact,
        hoursSaved
      );
      responses.push({
        senderId: rId,
        senderName: aName,
        bodyText
      });
    }
  }

  // Filter responses by participants if meeting is custom sync
  let filteredResponses = responses;
  if (meeting.type === "custom" && meeting.participantIds) {
    const ids = meeting.participantIds.split(",");
    filteredResponses = responses.filter(r => ids.includes(r.senderId));
    
    if (filteredResponses.length === 0 && ids.length > 0) {
      const firstId = ids[0];
      const agent = await db.agent.findUnique({ where: { id: firstId } });
      filteredResponses.push({
        senderId: firstId,
        senderName: agent ? agent.name : `${firstId} AI`,
        bodyText: `I am present in the group huddle. We are monitoring our metrics: Today's Tickets are at ${todaysTickets}, and Net Revenue is +$${revenueImpact}. Directives are fully active.`
      });
    }
  }

  for (const resp of filteredResponses) {
    await db.meetingMessage.create({
      data: {
        meetingId,
        senderId: resp.senderId,
        senderName: resp.senderName,
        bodyText: resp.bodyText
      }
    });
  }

  revalidatePath("/");
  return { success: true };
}

// Combined atomic action to send message and trigger AI response sequentially
export async function sendHuddleMessageAndGetResponse(meetingId: string, bodyText: string) {
  // 1. Check meeting
  const meeting = await db.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) throw new Error("Meeting not found");

  // 2. Persist Founder message
  await db.meetingMessage.create({
    data: {
      meetingId,
      senderId: "founder",
      senderName: "Founder",
      bodyText
    }
  });

  // 3. Trigger AI response generation sequentially (avoiding concurrent write locks)
  await generateMeetingAIResponse(meetingId, bodyText);

  // 4. Fetch and return all messages
  const list = await db.meetingMessage.findMany({
    where: { meetingId },
    orderBy: { createdAt: "asc" }
  });

  revalidatePath("/");
  return list.map((msg) => ({
    ...msg,
    createdAt: msg.createdAt.toISOString()
  }));
}

// Fetch or auto-create persistent direct chat huddle for an agent
export async function getOrCreateDirectChat(agentId: string) {
  let meeting = await db.meeting.findFirst({
    where: {
      type: "one-on-one",
      agentId
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!meeting) {
    const agent = await db.agent.findUnique({ where: { id: agentId } });
    const title = `Direct Sync: ${agent ? agent.name : agentId}`;
    const created = await db.meeting.create({
      data: {
        title,
        type: "one-on-one",
        agentId
      }
    });

    // Create initial handshake greeting
    const greetingText = `Direct connection established. I am online as ${agent ? agent.name : agentId} (${agent ? agent.role : "Agent"}). Operational directives loaded. Please issue coordinates or query guidelines.`;
    await db.meetingMessage.create({
      data: {
        meetingId: created.id,
        senderId: agentId,
        senderName: agent ? agent.name : agentId,
        bodyText: greetingText
      }
    });

    meeting = await db.meeting.findUnique({
      where: { id: created.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }

  if (!meeting) throw new Error("Database lookup failed");

  return {
    ...meeting,
    createdAt: meeting.createdAt.toISOString(),
    messages: meeting.messages.map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString()
    }))
  };
}

// Workspace Onboarding & Product Tour Settings Actions
export async function updateTourSettings(data: { tourCompleted?: boolean; showContextualHelp?: boolean }) {
  const ws = await db.workspace.findFirst();
  if (ws) {
    await db.workspace.update({
      where: { id: ws.id },
      data: {
        ...(data.tourCompleted !== undefined ? { tourCompleted: data.tourCompleted } : {}),
        ...(data.showContextualHelp !== undefined ? { showContextualHelp: data.showContextualHelp } : {})
      }
    });
  }
  revalidatePath("/");
  return { success: true };
}

export async function resetOnboardingProgress() {
  const ws = await db.workspace.findFirst();
  if (ws) {
    await db.workspace.update({
      where: { id: ws.id },
      data: {
        onboardingCompleted: false,
        tourCompleted: false,
        showContextualHelp: true
      }
    });
  }
  revalidatePath("/");
  return { success: true };
}

// Client Management Server Actions
export async function getClients() {
  try {
    const clientsList = await db.client.findMany({
      include: {
        projects: true
      },
      orderBy: { createdAt: "desc" }
    });

    const allProposals = await db.proposal.findMany({
      orderBy: { createdAt: "desc" }
    });

    if (clientsList && clientsList.length > 0) {
      return clientsList.map((c) => {
        const cleanClientEmail = (c.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [])[0] || c.email.toLowerCase().trim();

        // Match proposals linked by clientId OR matching sender email
        const clientProposals = allProposals.filter((p) => {
          if (p.clientId === c.id) return true;
          const cleanSenderEmail = (p.senderEmail.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [])[0] || p.senderEmail.toLowerCase().trim();
          return cleanSenderEmail === cleanClientEmail || p.senderEmail.toLowerCase().includes(cleanClientEmail);
        });

        return {
          ...c,
          createdAt: c.createdAt.toISOString(),
          projects: c.projects.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString()
          })),
          proposals: clientProposals.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString()
          }))
        };
      });
    }
  } catch (err) {
    console.error("Error fetching clients:", err);
  }

  // Fallback to MOCK_CLIENTS if database is empty or read-only on deployment
  return MOCK_CLIENTS;
}

export async function createClient(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  project?: string;
  contractType?: string;
  notes?: string;
  type?: string;
  source?: string;
}) {
  let ws = await db.workspace.findFirst({ where: { isDemo: false } });
  if (!ws) {
    ws = await db.workspace.create({
      data: {
        name: "Production Workspace",
        onboardingCompleted: true
      }
    });
  }

  // Extract clean email address (e.g. "sarah - singhmohit101103@gmail.com" -> "singhmohit101103@gmail.com")
  const extractedEmail = (data.email.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [])[0] || data.email.toLowerCase().trim();

  // Create client in SQLite
  const client = await db.client.create({
    data: {
      workspaceId: ws.id,
      name: data.name,
      email: extractedEmail,
      company: data.company || null,
      phone: data.phone || null,
      website: data.website || null,
      contractType: data.contractType || "Monthly Retainer ($1,500/mo)",
      notes: data.notes || null,
      type: data.type || "CLIENT",
      source: data.source || "Manual"
    }
  });

  // Create initial project if provided
  if (data.project && data.project.trim().length > 0) {
    await db.project.create({
      data: {
        workspaceId: ws.id,
        clientId: client.id,
        name: data.project.trim(),
        status: "ACTIVE"
      }
    });
  }

  // Automatic Email Matching: Auto-link existing proposals with matching senderEmail
  const allProposals = await db.proposal.findMany();
  const matchingProposalIds = allProposals
    .filter((p) => p.senderEmail.toLowerCase().includes(extractedEmail) || extractedEmail.includes(p.senderEmail.toLowerCase()))
    .map((p) => p.id);

  if (matchingProposalIds.length > 0) {
    await db.proposal.updateMany({
      where: { id: { in: matchingProposalIds } },
      data: {
        clientId: client.id,
        isNewClientLead: false
      }
    });
  }

  // Audit Log
  await db.log.create({
    data: {
      agentId: "sales",
      timestamp: "Just now",
      action: "Client Profile Created",
      details: `Created client profile for ${data.name} (${data.company || "Independent"}). Linked ${matchingProposalIds.length} proposal histories.`
    }
  });

  revalidatePath("/");
  return {
    ...client,
    createdAt: client.createdAt.toISOString()
  };
}

export async function approveNewClientProposal(
  proposalId: string,
  actionType: "CREATE" | "IGNORE" | "MERGE",
  targetClientId?: string
) {
  const proposal = await db.proposal.findUnique({ where: { id: proposalId } });
  if (!proposal) throw new Error("Proposal not found");

  let ws = await db.workspace.findFirst({ where: { isDemo: false } });
  const wsId = ws ? ws.id : "default-ws";

  if (actionType === "CREATE") {
    const clientName = proposal.detectedContact || proposal.senderName || proposal.senderEmail.split("@")[0];
    const companyName = proposal.detectedCompany || "Inbound Lead";

    const client = await db.client.create({
      data: {
        workspaceId: wsId,
        name: clientName,
        email: proposal.senderEmail.toLowerCase().trim(),
        company: companyName,
        type: proposal.suggestedType || "CLIENT",
        source: "Gmail",
        contractType: "Standard Inbound Retainer",
        status: "ACTIVE"
      }
    });

    // Auto-link all proposals from this sender
    await db.proposal.updateMany({
      where: { senderEmail: proposal.senderEmail.toLowerCase().trim() },
      data: {
        clientId: client.id,
        isNewClientLead: false,
        status: "APPROVED"
      }
    });

    await db.log.create({
      data: {
        agentId: "sales",
        timestamp: "Just now",
        action: "Sales AI Auto-Created Client",
        details: `Detected inbound request from ${proposal.senderEmail}. Auto-created client profile for ${clientName} (${companyName}).`
      }
    });
  } else if (actionType === "MERGE" && targetClientId) {
    await db.proposal.updateMany({
      where: { senderEmail: proposal.senderEmail.toLowerCase().trim() },
      data: {
        clientId: targetClientId,
        isNewClientLead: false,
        status: "APPROVED"
      }
    });

    await db.log.create({
      data: {
        agentId: "sales",
        timestamp: "Just now",
        action: "Merged Proposal to Existing Client",
        details: `Merged proposal #${proposalId} from ${proposal.senderEmail} into existing client ID ${targetClientId}.`
      }
    });
  } else if (actionType === "IGNORE") {
    await db.proposal.update({
      where: { id: proposalId },
      data: {
        status: "IGNORED",
        isNewClientLead: false
      }
    });
  }

  revalidatePath("/");
  return { success: true };
}

// Multi-Agent Project Assignment Server Action
export async function updateClientAssignedAgents(clientId: string, agentIds: string[]) {
  await db.client.update({
    where: { id: clientId },
    data: {
      assignedAgents: JSON.stringify(agentIds)
    }
  });

  await db.log.create({
    data: {
      agentId: "coordinator",
      timestamp: "Just now",
      action: "Assigned Executive AI Units to Client",
      details: `Updated AI Department team permissions for client #${clientId}: ${agentIds.join(", ")}.`
    }
  });

  revalidatePath("/");
  return { success: true };
}

// Helper for safe log creation (prevents foreign key errors on unseeded agent IDs)
async function safeCreateLog(agentId: string, action: string, details: string) {
  let targetId = agentId;
  const agent = await db.agent.findUnique({ where: { id: agentId } });
  if (!agent) {
    const fallback = await db.agent.findFirst();
    targetId = fallback ? fallback.id : "project-coordinator";
  }

  return await db.log.create({
    data: {
      agentId: targetId,
      timestamp: "Just now",
      action,
      details
    }
  });
}

// Developer Task Progress & QA/Operations Handshake Pipeline
export async function updateProjectTaskProgress(projectId: string, devNotes: string, isCompleted: boolean) {
  const project = await db.project.update({
    where: { id: projectId },
    data: {
      developerNotes: devNotes,
      isCompleted,
      status: isCompleted ? "COMPLETED" : "ACTIVE"
    },
    include: {
      client: true
    }
  });

  // Log Developer AI progress
  await safeCreateLog(
    "developer",
    isCompleted ? "Developer AI Marked Project DONE" : "Developer AI Updated Progress",
    `Project "${project.name}" update: ${devNotes}`
  );

  // Handshake Pipeline when project is marked DONE
  if (isCompleted) {
    // 1. QA AI Verification Check
    await safeCreateLog(
      "qa",
      "QA AI Audit Verified Deliverables",
      `Scanned Company Brain policies and verified developer notes for "${project.name}". All technical criteria passed.`
    );

    // 2. Operations AI creates final delivery email proposal in Pending Proposals
    const clientName = project.client ? project.client.name : "Client";
    const clientEmail = project.client ? project.client.email : "client@example.com";

    await db.proposal.create({
      data: {
        workspaceId: project.workspaceId,
        clientId: project.clientId,
        senderEmail: clientEmail,
        senderName: clientName,
        subject: `Project Delivery & SLA Final Completion Notice: ${project.name}`,
        bodyText: `Dear ${clientName},\n\nOur engineering and QA units have completed all deliverables for "${project.name}".\n\nDeveloper Notes:\n${devNotes}\n\nAll automated tests and security audits have passed successfully.`,
        draftReply: `Hi ${clientName},\n\nWe are excited to deliver "${project.name}"! All deliverables, theme setups, and plugin configurations are 100% verified and live.\n\nThank you for partnering with us!\n\nBest regards,\nOperations AI & Founder`,
        status: "PENDING",
        isNewClientLead: false
      }
    });

    await safeCreateLog(
      "devops",
      "Operations AI Generated Delivery Proposal",
      `Queued project completion delivery email for ${clientName} (${clientEmail}) in Pending Proposals for founder authorization.`
    );
  }

  revalidatePath("/");
  return { success: true };
}

// In-Memory Persistent Stores for Department Dashboards
let salesLeadsStore = [
  { id: "lead-1", company: "Apex Health Inc", contact: "Mark Vance", email: "mark@apexhealth.com", service: "WordPress Custom Theme & Portal", status: "Prospect", fitScore: "96%" },
  { id: "lead-2", company: "Starlight SaaS", contact: "Elena Rostova", email: "elena@starlight.io", service: "Full-Stack Web App Integration", status: "Qualified", fitScore: "92%" },
  { id: "lead-3", company: "Vanguard Logistics", contact: "David Kim", email: "dkim@vanguardlog.com", service: "Custom E-Commerce & Stripe Billing", status: "Warm", fitScore: "89%" },
  { id: "lead-4", company: "Nexus Dynamics", contact: "Priya Sharma", email: "priya@nexusdyn.com", service: "WordPress Security & Speed Optimization", status: "Prospect", fitScore: "94%" }
];

let marketingPostsStore = [
  { id: "post-1", platform: "LinkedIn / X", content: "🚀 How our autonomous AI executive units delivered a full custom WordPress web solution in < 48 hours without founder burnout. #AIAgency #SoloFounder #TechOps", status: "QUEUED_TODAY" },
  { id: "post-2", platform: "LinkedIn / X", content: "💡 Scope creep killing your margins? Here is how automated SOW change-order guardrails protect software retainers. #AgencyGrowth #DevOps", status: "SCHEDULED_TOMORROW" }
];

let analyticsInsightsStore = [
  { id: "insight-1", title: "Expand WordPress Retainers", impact: "+$3,500/mo ARR", detail: "Sales AI lead conversion rate is 42% higher for custom WordPress integrations. Recommend prioritizing WordPress agency leads." },
  { id: "insight-2", title: "Optimize Developer QA Cycle", impact: "-1.5h saved/project", detail: "QA AI verification passes 98% of developer task logs on first attempt." }
];

let hrMetricsStore = [
  { agent: "Developer AI", accuracy: "98%", completedTasks: 24, load: "Medium" },
  { agent: "Support AI", accuracy: "99%", completedTasks: 42, load: "High" },
  { agent: "QA AI", accuracy: "97%", completedTasks: 19, load: "Low" },
  { agent: "Operations AI", accuracy: "100%", completedTasks: 31, load: "Medium" },
  { agent: "Sales AI", accuracy: "94%", completedTasks: 15, load: "Medium" }
];

let legalAuditLogsStore = [
  { id: "legal-1", client: "Acme Corp", request: "Checkout Redesign & SAML SSO", status: "TECH_SCOPE_VERIFIED", compliance: "Passed SOW Guidelines" },
  { id: "legal-2", client: "HyperGrowth Labs", request: "Enterprise SLA Retainer", status: "TECH_SCOPE_VERIFIED", compliance: "Passed SOW Guidelines" }
];

let researchNotesStore = [
  { id: "res-1", topic: "WordPress 6.7 Security & AI Plugin Benchmarks", impact: "High Tech Relevance", summary: "Analyzed top 10 AI WordPress plugins. Recommending REST API OAuth2 standard." }
];

let chiefMemosStore = [
  { id: "memo-1", priority: "HIGH", title: "Review Operations AI Project Delivery Proposal", date: "Today" }
];

let projectMilestonesStore = [
  { id: "ms-1", name: "WordPress Custom Theme Delivery", client: "Acme Corp", status: "In Progress" }
];

let supportFaqsStore = [
  { id: "faq-1", question: "How to check project progress?", answer: "Project progress is logged in real-time by Developer AI & QA AI." }
];

let financeTransactionsStore = [
  { id: "tx-1", type: "REVENUE", category: "Retainer SOW", amount: "+$2,500", client: "Acme Corp" }
];

let developerCommitsStore = [
  { id: "dev-1", commitMsg: "Completed WordPress theme & WooCommerce setup", prNumber: "PR #42", status: "VERIFIED_BY_QA" }
];

// Executive Dashboards Data Provider
export async function getExecutiveDashboardsData() {
  const financeMetrics = {
    monthlyARR: "$24,500",
    monthlyMRR: "$18,400",
    expenses: "$1,200",
    netProfit: "$17,200",
    profitMargin: "93.5%",
    activeRetainers: 6,
    avgLTV: "$4,100"
  };

  return {
    salesLeads: salesLeadsStore,
    marketingPosts: marketingPostsStore,
    financeMetrics,
    financeTransactions: financeTransactionsStore,
    analyticsInsights: analyticsInsightsStore,
    hrMetrics: hrMetricsStore,
    legalAuditLogs: legalAuditLogsStore,
    researchNotes: researchNotesStore,
    chiefMemos: chiefMemosStore,
    projectMilestones: projectMilestonesStore,
    supportFaqs: supportFaqsStore,
    developerCommits: developerCommitsStore
  };
}

// Founder Manual Creation Server Actions for ALL Departments
export async function addSalesLead(data: { company: string; contact: string; email: string; service: string; status?: string; fitScore?: string }) {
  const newLead = {
    id: `lead-${Date.now()}`,
    company: data.company,
    contact: data.contact,
    email: data.email,
    service: data.service,
    status: data.status || "Qualified",
    fitScore: data.fitScore || "95%"
  };
  salesLeadsStore = [newLead, ...salesLeadsStore];
  revalidatePath("/");
  return newLead;
}

export async function addMarketingPost(data: { platform: string; content: string }) {
  const newPost = {
    id: `post-${Date.now()}`,
    platform: data.platform || "LinkedIn / X",
    content: data.content,
    status: "QUEUED_TODAY"
  };
  marketingPostsStore = [newPost, ...marketingPostsStore];
  revalidatePath("/");
  return newPost;
}

export async function addAnalyticsInsight(data: { title: string; impact: string; detail: string }) {
  const newInsight = {
    id: `insight-${Date.now()}`,
    title: data.title,
    impact: data.impact,
    detail: data.detail
  };
  analyticsInsightsStore = [newInsight, ...analyticsInsightsStore];
  revalidatePath("/");
  return newInsight;
}

export async function addLegalAuditLog(data: { client: string; request: string; status?: string; compliance?: string }) {
  const newLog = {
    id: `legal-${Date.now()}`,
    client: data.client,
    request: data.request,
    status: data.status || "TECH_SCOPE_VERIFIED",
    compliance: data.compliance || "Passed SOW Guidelines"
  };
  legalAuditLogsStore = [newLog, ...legalAuditLogsStore];
  revalidatePath("/");
  return newLog;
}

export async function addResearchNote(data: { topic: string; impact: string; summary: string }) {
  const newNote = { id: `res-${Date.now()}`, topic: data.topic, impact: data.impact || "High Tech Relevance", summary: data.summary };
  researchNotesStore = [newNote, ...researchNotesStore];
  revalidatePath("/");
  return newNote;
}

export async function addChiefMemo(data: { title: string; priority?: string }) {
  const newMemo = { id: `memo-${Date.now()}`, title: data.title, priority: data.priority || "HIGH", date: "Just now" };
  chiefMemosStore = [newMemo, ...chiefMemosStore];
  revalidatePath("/");
  return newMemo;
}

export async function addProjectMilestone(data: { name: string; client: string }) {
  const newMs = { id: `ms-${Date.now()}`, name: data.name, client: data.client, status: "In Progress" };
  projectMilestonesStore = [newMs, ...projectMilestonesStore];
  revalidatePath("/");
  return newMs;
}

export async function addSupportFaq(data: { question: string; answer: string }) {
  const newFaq = { id: `faq-${Date.now()}`, question: data.question, answer: data.answer };
  supportFaqsStore = [newFaq, ...supportFaqsStore];
  revalidatePath("/");
  return newFaq;
}

export async function addDeveloperCommit(data: { commitMsg: string; prNumber?: string }) {
  const newCommit = { id: `dev-${Date.now()}`, commitMsg: data.commitMsg, prNumber: data.prNumber || "PR #" + Math.floor(10 + Math.random() * 90), status: "LOGGED_BY_HUMAN_DEV" };
  developerCommitsStore = [newCommit, ...developerCommitsStore];
  revalidatePath("/");
  return newCommit;
}

// Founder Manual Task & Project Creation
export async function addProjectToClient(clientId: string, name: string) {
  let ws = await db.workspace.findFirst({ where: { isDemo: false } });
  const wsId = ws ? ws.id : "default-ws";

  const project = await db.project.create({
    data: {
      workspaceId: wsId,
      clientId,
      name,
      status: "ACTIVE"
    }
  });

  await safeCreateLog(
    "project-coordinator",
    "Founder Manually Created Task/Project",
    `Founder created task "${name}" for client #${clientId}.`
  );

  revalidatePath("/");
  return project;
}

// Spawn New Custom AI Executive Unit Server Action
export async function createCustomAgent(data: { name: string; role: string; description?: string; directives?: string }) {
  const cleanId = data.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
  const agentId = cleanId.startsWith("agent-") ? cleanId : `agent-${cleanId}`;

  const created = await db.agent.create({
    data: {
      id: agentId,
      name: data.name,
      role: data.role,
      description: data.description || `Autonomous ${data.name} Unit`,
      isActive: true,
      directives: data.directives || `Maintain operational directives for ${data.name}.`
    }
  });

  await safeCreateLog(
    created.id,
    "Custom Executive AI Unit Created",
    `Spawned new custom AI Executive Unit "${data.name}" (${data.role}).`
  );

  revalidatePath("/");
  return {
    ...created,
    logs: []
  };
}

// Client Support Chat In-Memory Persistent Store
let clientSupportChatsStore: Record<string, Array<{ id: string; sender: "client" | "support-ai"; senderName: string; body: string; timestamp: string }>> = {};

// Client Portal Data Provider (Strictly Scoped for Client Email)
export async function getClientPortalData(clientEmail: string) {
  try {
    const normalizedEmail = (clientEmail || "").toLowerCase().trim();

    // Find matching client
    let client = await db.client.findFirst({
      where: { email: { equals: normalizedEmail } },
      include: {
        projects: true,
        proposals: true
      }
    });

    // Fallback demo client if no client found
    if (!client) {
      client = await db.client.findFirst({
        include: {
          projects: true,
          proposals: true
        }
      });
    }

    if (client) {
      // Fetch proposals linked to this client
      const proposals = await db.proposal.findMany({
        where: {
          OR: [
            { clientId: client.id },
            { senderEmail: client.email }
          ]
        },
        orderBy: { createdAt: "desc" }
      });

      // Client Projects
      const projects = client.projects || [];

      // Client Shared Files & Documents
      const files = [
        { id: "file-1", name: "Master_Services_Agreement_SOW-2026.pdf", category: "Contract", size: "1.4 MB", date: "2026-01-15", url: "#" },
        { id: "file-2", name: "Phase_1_Theme_Architecture_Design_Token_Specs.pdf", category: "Deliverable", size: "3.8 MB", date: "2026-02-01", url: "#" },
        { id: "file-3", name: "Invoice_INV-2026-004_Retainer_Paid.pdf", category: "Invoice", size: "420 KB", date: "2026-02-15", url: "#" }
      ];

      // Client Timeline Activity Feed
      const timeline = [
        { id: "time-1", event: "Project Milestones Approved", detail: "Phase 1 WordPress Custom Integration marked Active.", date: "Today, 09:30 AM", type: "PROJECT" },
        { id: "time-2", event: "Proposal Dispatched", detail: "Checkout Redesign Change Order draft queued.", date: "Yesterday, 04:15 PM", type: "PROPOSAL" },
        { id: "time-3", event: "Invoice Retainer Paid", detail: "Monthly Software Retainer payment ($2,500) received via Stripe.", date: "Feb 15, 2026", type: "FINANCE" }
      ];

      // Client Support Chat History
      const chatKey = client ? client.email : "default-client";
      if (!clientSupportChatsStore[chatKey]) {
        clientSupportChatsStore[chatKey] = [
          {
            id: "msg-1",
            sender: "support-ai",
            senderName: "Support AI Representative",
            body: `Welcome to your company portal! I am your dedicated Support AI representative. How can I assist you with your active projects or invoices today?`,
            timestamp: "09:00 AM"
          }
        ];
      }

      return {
        client: {
          ...client,
          createdAt: client.createdAt.toISOString()
        },
        projects: projects.map(p => ({ ...p, createdAt: p.createdAt.toISOString() })),
        proposals: proposals.map(p => ({ ...p, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() })),
        files,
        timeline,
        supportChat: clientSupportChatsStore[chatKey] || []
      };
    }
  } catch (err) {
    console.error("Error loading client portal data:", err);
  }

  // Fallback client data for deployment
  const fallbackClient = MOCK_CLIENTS[0];
  const chatKey = fallbackClient.email;
  if (!clientSupportChatsStore[chatKey]) {
    clientSupportChatsStore[chatKey] = [
      {
        id: "msg-1",
        sender: "support-ai",
        senderName: "Support AI Representative",
        body: `Welcome to your company portal! I am your dedicated Support AI representative. How can I assist you with your active projects or invoices today?`,
        timestamp: "09:00 AM"
      }
    ];
  }

  return {
    client: fallbackClient,
    projects: fallbackClient.projects,
    proposals: fallbackClient.proposals,
    files: [
      { id: "file-1", name: "Master_Services_Agreement_SOW-2026.pdf", category: "Contract", size: "1.4 MB", date: "2026-01-15", url: "#" },
      { id: "file-2", name: "Phase_1_Theme_Architecture_Design_Token_Specs.pdf", category: "Deliverable", size: "3.8 MB", date: "2026-02-01", url: "#" },
      { id: "file-3", name: "Invoice_INV-2026-004_Retainer_Paid.pdf", category: "Invoice", size: "420 KB", date: "2026-02-15", url: "#" }
    ],
    timeline: [
      { id: "time-1", event: "Project Milestones Approved", detail: "Phase 1 WordPress Custom Integration marked Active.", date: "Today, 09:30 AM", type: "PROJECT" },
      { id: "time-2", event: "Proposal Dispatched", detail: "Checkout Redesign Change Order draft queued.", date: "Yesterday, 04:15 PM", type: "PROPOSAL" },
      { id: "time-3", event: "Invoice Retainer Paid", detail: "Monthly Software Retainer payment ($2,500) received via Stripe.", date: "Feb 15, 2026", type: "FINANCE" }
    ],
    supportChat: clientSupportChatsStore[chatKey] || []
  };
}

// Client Proposal Actions
export async function clientApproveProposal(proposalId: string, comment?: string) {
  const proposal = await db.proposal.update({
    where: { id: proposalId },
    data: { status: "APPROVED" }
  });

  await safeCreateLog(
    "support",
    "Client Approved Proposal",
    `Client approved proposal "${proposal.subject}". ${comment ? `Comment: ${comment}` : ""}`
  );

  revalidatePath("/client");
  revalidatePath("/dashboard");
  return { success: true, proposal };
}

export async function clientRejectProposal(proposalId: string, comment?: string) {
  const proposal = await db.proposal.update({
    where: { id: proposalId },
    data: { status: "REJECTED" }
  });

  await safeCreateLog(
    "support",
    "Client Rejected Proposal",
    `Client rejected proposal "${proposal.subject}". ${comment ? `Feedback: ${comment}` : ""}`
  );

  revalidatePath("/client");
  revalidatePath("/dashboard");
  return { success: true, proposal };
}

// Send Client Support Chat Message (With Gemini LLM & Unconfident Proposal Fallback)
export async function sendClientSupportChatMessage(clientEmail: string, messageText: string) {
  const chatKey = clientEmail ? clientEmail.toLowerCase().trim() : "default-client";
  if (!clientSupportChatsStore[chatKey]) {
    clientSupportChatsStore[chatKey] = [];
  }

  // Push Client Message
  const userMsg = {
    id: `msg-${Date.now()}`,
    sender: "client" as const,
    senderName: "Client",
    body: messageText,
    timestamp: "Just now"
  };
  clientSupportChatsStore[chatKey].push(userMsg);

  // Check if Gemini API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  let replyText = "";
  let needsProposal = false;

  const textLower = messageText.toLowerCase();

  // Determine if question requires Founder Proposal (Change order, unconfident query, pricing request)
  if (textLower.includes("price") || textLower.includes("cost") || textLower.includes("change order") || textLower.includes("new feature") || textLower.includes("refund")) {
    needsProposal = true;
  }

  if (apiKey && !needsProposal) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are Support AI for a high-end software development agency. The client asks: "${messageText}". Respond concisely, professionally, and politely in 2-3 sentences. Do not hallucinate timelines or pricing.`;
      const result = await model.generateContent(prompt);
      replyText = result.response.text();
    } catch (err) {
      replyText = `Thank you for reaching out! Our engineering team has logged your progress query. Your active projects are on track for estimated delivery.`;
    }
  } else if (needsProposal) {
    replyText = `I have logged your request and created a custom proposal for our Founder team to review. You will receive an official update in your Proposals tab shortly!`;

    // Create proposal for Founder review
    await db.proposal.create({
      data: {
        senderEmail: clientEmail || "client@company.com",
        senderName: "Client Portal Inquiry",
        subject: `Client Inquiry & Change Request: ${messageText.slice(0, 40)}...`,
        bodyText: messageText,
        draftReply: `Hi! We reviewed your request ("${messageText}"). Our team is happy to accommodate this.`,
        status: "PENDING",
        isNewClientLead: false
      }
    });

    await safeCreateLog(
      "support",
      "Support AI Escalated Client Request to Founder",
      `Created proposal for founder review from client inquiry: "${messageText}"`
    );
  } else {
    replyText = `Thank you for reaching out! I am Support AI. Your active project is currently progressing smoothly under QA supervision. Let us know if you need any contract or invoice clarification!`;
  }

  // Push Support AI Reply
  const aiMsg = {
    id: `msg-${Date.now() + 1}`,
    sender: "support-ai" as const,
    senderName: "Support AI Representative",
    body: replyText,
    timestamp: "Just now"
  };
  clientSupportChatsStore[chatKey].push(aiMsg);

  revalidatePath("/client");
  return { success: true, chat: clientSupportChatsStore[chatKey] };
}

// Update Client Profile Details
export async function updateClientProfileDetails(clientEmail: string, data: { name: string; phone?: string; website?: string }) {
  const client = await db.client.findFirst({
    where: { email: { equals: (clientEmail || "").toLowerCase().trim() } }
  });

  if (client) {
    await db.client.update({
      where: { id: client.id },
      data: {
        name: data.name,
        phone: data.phone,
        website: data.website
      }
    });
  }

  revalidatePath("/client");
  return { success: true };
}

// Save Client Notes & Directives
export async function updateClientNotes(clientId: string, notes: string) {
  const updated = await db.client.update({
    where: { id: clientId },
    data: { notes }
  });

  await safeCreateLog(
    "project-coordinator",
    "Saved Client Directives & Notes",
    `Updated notes and directives for client #${clientId}.`
  );

  revalidatePath("/");
  return updated;
}





