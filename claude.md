## 1. Project Overview

**Job Assistant AI** is a fullstack application (**Next.js + TypeScript**) that helps candidates to:  
- Optimize their CV  
- Generate cover letters and emails  
- Prepare Q&A about their profile  
- Simulate interviews  

Modular architecture with external services: **Firecrawl, Vectorize, Pinecone, MCP/AI SDK**.

---

## 2. Tech Stack and External Services

- Frontend + backend: **Next.js + TypeScript** (App Router, API routes)  
- CV parsing (PDF/Word/LinkedIn): **Firecrawl**  
- Embeddings generation: **Vectorize** (platform.vectorize.io / vectorize.io)  
- Vector storage / similarity: **Pinecone**  
- Text generation / LLM: **MCP Servers + AI SDK (Model Context Protocol)**  
- UI: **TailwindCSS**

---

## 3. Library and Service Links (Quick Reference)

- Firecrawl → [firecrawl.dev](https://www.firecrawl.dev/)  
- Firecrawl Docs → [docs.firecrawl.dev](https://docs.firecrawl.dev/)  
- Vectorize Platform → [platform.vectorize.io](https://platform.vectorize.io/)  
- Vectorize Docs → [docs.vectorize.io](https://docs.vectorize.io/)  
- Pinecone → [pinecone.io](https://www.pinecone.io/)  
- MCP / AI SDK → [modelcontextprotocol.io](https://modelcontextprotocol.io/)  
- MCP tools guide → [ai-sdk.dev](https://ai-sdk.dev/)  
- Next.js → [nextjs.org](https://nextjs.org/)  
- TailwindCSS → [tailwindcss.com](https://tailwindcss.com/)  

---

## 4. Initial Project Structure

```

job-assistant-ai/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ api/
│     ├─ upload/route.ts
│     ├─ generate/route.ts
│     ├─ cv/qna/route.ts
│     ├─ jd/match/route.ts
│     └─ interview/route.ts
├─ lib/
│  ├─ firecrawl.ts
│  ├─ vectorize.ts
│  ├─ pinecone.ts
│  └─ ai.ts
├─ prompts/
│  ├─ cover_letter.ts
│  ├─ recruiter_email.ts
│  ├─ qna.ts
│  ├─ jd_matching.ts
│  ├─ ats_optimization.ts
│  └─ interview.ts
├─ components/
│  ├─ CVUploader.tsx
│  └─ ResultsCard.tsx
├─ public/
├─ styles/
│  └─ globals.css
├─ .env.example
├─ package.json
├─ tailwind.config.js
└─ README.md

```

---

# Job Assistant AI — CLAUDE.md (Agent Summary)

## A. Brief Context

App **Next.js + TypeScript** that:  
- Extracts/parses CVs (Firecrawl)  
- Creates embeddings (Vectorize)  
- Stores/queries in Pinecone  
- Generates text with MCP/AI SDK (MCP Servers)  
- UI built with TailwindCSS  

---

## B. Stack

- Next.js (App Router) + TypeScript  
- TailwindCSS  
- Firecrawl (PDF/Word/LinkedIn parsing)  
- Vectorize (platform.vectorize.io) — embeddings  
- Pinecone — vector DB  
- MCP / AI SDK (MCP Servers) — text generation  

---

## C. Expected High-Level Structure

- `/app` → pages + api routes  
- `/lib` → firecrawl.ts, vectorize.ts, pinecone.ts, ai.ts  
- `/prompts` → templates  
- `/components` → CVUploader, ResultsCard  
- `.env.example` → keys: FIRECRAWL_API_KEY, VECTORIZE_API_KEY, PINECONE_API_KEY, MCP_API_KEY  

---

## D. Rules and Standards

- Strict, modular, well-documented TypeScript  
- Limit uploads (env `MAX_UPLOAD_SIZE_MB`)  
- Never expose API keys to the client  
- Ready for **Vercel** deployment  

---

## E. Typical Tasks (Suggested Order)

1. Implement `lib/firecrawl.ts` (S3 or direct API)  
2. Pipeline: parse → chunk → create embeddings → Pinecone upsert  
3. Endpoints: `/api/upload`, `/api/generate`, `/api/cv/qna`  
4. Define reusable prompts  
5. Minimal UI: upload + results  

---

## F. Agent Notes

- Generate typed code with basic unit tests and request/response examples  
- Use clear commit messages when modifying files  

---
