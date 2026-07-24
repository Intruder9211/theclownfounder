# clownfounder – Autonomous Company OS Custom Instructions

This document stores the permanent development rules, design philosophies, and architectural principles for the **clownfounder** project.

---

## 1. Core Mission & Philosophy
*   **Mission**: Build the world's best operating system for solo founders where AI employees collaborate to run a business while the founder focuses only on strategic decisions.
*   **Decisions over Chats**: Reject noisy AI chat sidebars. AI agents collaborate over shared DB context, presenting proposed actions (Proposals) in a structured feed.
*   **Premium Quality**: Match the design density, responsiveness, and clean spacing of Linear, Stripe, Notion, Vercel, and Apple.

---

## 2. Technical Stack & Clean Architecture
*   **Frontend**: Next.js App Router, TypeScript, React Server Components.
*   **Backend & APIs**: Next.js Server Actions, SQLite (via Prisma ORM) for zero-dependency local storage.
*   **Agent Engine**: Vanilla SDK calls with strict `zod` schema definitions for structured outputs. Avoid heavy agent libraries like LangChain or CrewAI.
*   **Design system**: Vanilla CSS HSL tokens, 8px layout grid, 0.5px borders, Geist/Inter typography, and cubic-bezier spring animations.

---

## 3. Strict Code Modification Rules (PERMANENT)
1.  **Never rewrite an entire file** unless absolutely necessary. Modify only the lines that changed.
2.  **Show exact code deltas**. Mention the filename, function, and line range in updates.
3.  **Follow SOLID and Clean Architecture** principles. Avoid hacks; refactor existing logic instead.
4.  **No unused dependencies**. Never install packages without explicit, justified reasons.
5.  **Before writing code, explain**:
    *   What the change is.
    *   Why it is needed.
    *   The impact on the rest of the project.

---

## 4. MVP Target: Support-to-Product Workflow
Our MVP scope is limited to the single-loop:
1.  Customer Support Email is received.
2.  Support AI analyzes ticket and drafts email reply.
3.  Finance AI checks Stripe customer plan & LTV.
4.  Product AI logs bug summaries.
5.  Founder approves (dispatches email, archives) or rejects (stores structured feedback for learning).
6.  System proceeds to load the next ticket automatically.

---

## 5. Prioritized Feature Construction Order
1.  **Editable AI Draft** (In-app draft updating and saving).
2.  **Approve Workflow** (Loading states, Resend mail dispatch, archive actions, timeline updates, auto-load next).
3.  **Reject Workflow** (Structured feedback collection: incorrect info, wrong tone, human fallback).
4.  **AI Reasoning Panel** (Confidence scores, Risk levels, History, Stripe checks, Policy references).
5.  **Activity Timeline** (Displaying chronological agent collaboration actions).
6.  **Keyboard Shortcuts** (`j`/`k`, `A`, `R`, `E`, `Esc`, `Cmd+K`).
7.  **Brain Page** (Shared company memory: docs, known bugs, FAQs, pricing guidelines).
8.  **AI Employee Status Dashboard** (Status, tasks, accuracy, activity logs, memory states).
9.  **Multi-Agent Coordination** (Sequential agent workflow executions).
