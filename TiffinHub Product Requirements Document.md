# TiffinHub: Product Requirements Document

Working name: TiffinHub | Version 1.0 | November 2026 | Author: Nik

Purpose: master brief to upload into Google Antigravity and to reuse in every later build chat. Priority tags used below: \[MVP\] build first, \[P2\] second phase, \[P3\] third phase.

## 1. Overview

TiffinHub is one web platform where customers subscribe to weekly or monthly home-cooked tiffin plans, vendors run their kitchen and subscriber list, delivery partners complete daily routes, and an admin oversees the marketplace. It is one codebase and one login, with role-based access deciding what each user sees.

### 1.1 Problem

- Small tiffin services still run on WhatsApp groups, notebooks and cash.
- Customers cannot easily skip or pause a meal and get fair credit for it.
- Vendors do not know how many meals to cook tomorrow, so they waste food or run short.
- Delivery is tracked on paper. Existing small apps cover only one side (customer-only or vendor-only).

### 1.2 Goals

- G1: replace WhatsApp-based tiffin management with one system for all four roles.
- G2: make skip, pause and billing automatic and fair (a skipped meal becomes wallet credit).
- G3: help vendors cook the right quantity using a demand forecast.
- G4: ship a deployed, production-quality product with a live link, tests, README, architecture diagram and a short demo video.

### 1.3 Non-goals for v1

Native mobile apps, live GPS tracking of riders, real vendor payouts (payout ledger only, Razorpay test mode), multi-language UI, coupons and loyalty programs, multi-city logistics.

## 2. Roles

| Role | Who | Main job in the system |
| --- | --- | --- |
| Customer | Students, office workers, families | Find a vendor, subscribe, skip or pause, pay, rate |
| Vendor | Home chef or tiffin business owner | Manage menu, plans, subscribers, tomorrow's cooking list, earnings |
| Delivery partner | Rider employed by or linked to a vendor | Complete the daily delivery list |
| Admin | Platform owner (Nik) | Approve vendors, handle complaints, view platform analytics |

## 3. Release plan

- Phase 1 MVP (weeks 1 to 4): auth and roles, vendor onboarding and approval, menus, plans, subscriptions, skip and pause, wallet with Razorpay test payments, nightly order generation, vendor kitchen sheet, basic admin. Deploy at the end of this phase.
- Phase 2 (weeks 5 and 6): delivery partner module, notifications, invoice PDFs, reviews, complaints, admin analytics.
- Phase 3 (weeks 7 and 8): AI features, polish, tests, README, demo video.
- Rule: redeploy after every phase so a working live version always exists.

## 4. Features by role

### 4.1 Common to all roles

- &#91;MVP\] Register and log in with email and password, refresh tokens, logout, forgot and reset password by email.
- &#91;MVP\] Role-based redirect after login to the correct dashboard.
- &#91;MVP\] Profile page (name, phone, photo).
- &#91;P2\] In-app notification bell with unread count, plus email notifications.
- &#91;MVP\] Consistent loading, empty and error states on every screen.

### 4.2 Customer

| Feature | Detail | Phase |
| --- | --- | --- |
| Addresses | Save multiple delivery addresses with area, pincode, landmark and a delivery note | MVP |
| Discover vendors | List vendors by area or pincode, filter by diet (veg, Jain, no onion-garlic, vegan, non-veg), price, rating and meal slot | MVP |
| Vendor page | About, kitchen area, sample weekly menu, plans, reviews | MVP |
| Subscribe | Pick plan, meal slots (breakfast, lunch, dinner), days of week, start date, address; see price summary; pay by wallet or Razorpay | MVP |
| Meal calendar | Month and week view of upcoming meals with status; tap a day to skip before cutoff | MVP |
| Skip a meal | Allowed before the vendor's cutoff time; credit goes to wallet automatically | MVP |
| Pause and resume | Pause for a date range; resume any time | MVP |
| Wallet | Balance, top-up through Razorpay test mode, full transaction history | MVP |
| Cancel subscription | Unused meals refunded to wallet by the rules in section 5 | P2 |
| Today's status | Prepared, out for delivery, delivered, with a notification at each step | P2 |
| Invoices and history | Order history, downloadable invoice PDFs | P2 |
| Reviews and complaints | Rate a delivered meal; raise a complaint (missing tiffin, quality, late) | P2 |
| AI meal search | Type a sentence like Jain, low oil, under 120 rupees and get matching vendors | P3 |

### 4.3 Vendor

| Feature | Detail | Phase |
| --- | --- | --- |
| Onboarding | Business name, kitchen address, service areas, cuisine, diet types, FSSAI number and document upload, contact, cutoff times; account stays Pending until admin approves | MVP |
| Dish library | Name, description, photo, diet tags, allergens, optional calories, price | MVP |
| Menu planner | Assign dishes to dates and meal slots, copy last week's menu | MVP |
| Plan builder | Define plans: slots, duration, price per meal, skip credit percentage, pause rules | MVP |
| Subscribers | List with status, address, preferences and notes such as less spice | MVP |
| Kitchen sheet | Tomorrow's meal count per slot, per dish and per area; print and CSV export | MVP |
| Delivery assignment | Group orders by area and assign to a delivery partner | P2 |
| Earnings | Gross, platform commission, net, and a payout ledger | P2 |
| Reviews and complaints | Inbox with reply option | P2 |
| Forecast card | Suggested meals to prepare tomorrow (see section 6) | P3 |
| AI tag suggestions | Suggested diet, allergen and calorie tags when adding a dish | P3 |

### 4.4 Delivery partner

| Feature | Detail | Phase |
| --- | --- | --- |
| Availability | Toggle on duty and off duty | P2 |
| Today's route | Pickup from vendor, then stops grouped by area; address, tap-to-call phone, delivery note, box count | P2 |
| Status updates | Picked up, delivered, customer not available, failed (reason and optional photo) | P2 |
| Daily summary | Delivered count, failed count, remaining stops | P2 |

### 4.5 Admin

| Feature | Detail | Phase |
| --- | --- | --- |
| Vendor approval | Queue with documents; approve, reject with reason, suspend | MVP |
| User management | Search users, deactivate accounts, change roles | MVP |
| Platform settings | Commission percentage, master list of service areas, meal slots, default cutoff times | MVP |
| Analytics dashboard | Users, active subscriptions, orders per day, gross value, commission, top vendors, skip rate | P2 |
| Complaints | Assign, resolve, issue wallet refund | P2 |
| Audit log | Who changed what and when, for sensitive actions | P2 |
| Notification templates | Edit email and in-app message text | P3 |

## 5. Business rules

| Rule | Definition |
| --- | --- |
| Meal slots | Breakfast, lunch, dinner. Each vendor sets a cutoff per slot (default: skip allowed until 8 PM the previous day for lunch and dinner, 10 PM for breakfast). |
| Plans | Prepaid. Weekly (7 days) or monthly (30 days) with chosen weekdays and slots. Price equals meals times per-meal price. |
| Skip | Allowed only before cutoff. The meal is marked Skipped and the vendor's skip credit percentage (default 100) of the meal price goes to the wallet. |
| Pause | Date range, start must be in the future. Paused days create no orders. Plan end date extends by the paused days (default) so no money is lost. |
| Wallet | Append-only ledger. Balance is the sum of transactions. Every change happens inside a database transaction with a concurrency check. |
| Cancellation | Refund of unused, non-cutoff-passed meals to wallet. Vendor may set a cancellation fee percentage. |
| Nightly job | At 9 PM daily, generate tomorrow's orders from active subscriptions, excluding skips and pauses. The job must be idempotent (safe to run twice). |
| Order states | Scheduled, Prepared, OutForDelivery, Delivered, Failed, Skipped, Cancelled. Only valid transitions are allowed; each change is logged with the user and time. |
| Failed delivery | Vendor-fault failures refund the meal to wallet; customer-not-available failures do not. |
| Commission | Platform keeps an admin-configured percentage of each delivered meal; shown in vendor earnings. |
| Vendor lifecycle | Pending, Approved, Rejected, Suspended. Only Approved vendors appear in discovery. |

## 6. Where AI is used

AI is limited to features where it adds real value and can be explained in an interview.

### 6.1 Vendor demand forecast \[P3\] (main AI feature)

- Goal: tell the vendor how many meals to prepare tomorrow per slot.
- Version 1 (rule-based, ship first): expected meals = active subscriptions for that day multiplied by (1 minus the average skip rate for that weekday over the last 4 weeks), plus a 5 percent buffer.
- Version 2 (optional): ML.NET time-series forecasting once at least 8 weeks of data exist. For the demo, seed realistic sample data and label it clearly as seeded.
- Track forecast versus actual meals delivered and show an accuracy percentage on the vendor dashboard.

### 6.2 Natural-language meal search \[P3\]

- The customer types a sentence. The backend sends it to the Gemini API (free tier) with instructions to return JSON only: diet, maximum price, cuisine, meal slot, spice level, tags.
- The backend validates the JSON against a strict schema, then runs a normal database query. The AI never touches the database directly.
- Fallback: if the AI call fails or returns invalid JSON, show standard keyword search.

### 6.3 Dish tag suggestions \[P3\]

- When a vendor adds a dish name and description, AI suggests diet, allergen and rough calorie tags. The vendor reviews and confirms; nothing is saved without approval. Show a note that calorie values are estimates.

### 6.4 Review summary \[P3, optional\]

- Summarize the last 30 days of reviews and complaints into three short bullet points for the vendor and admin.

### 6.5 AI guardrails

- API keys stay on the server only. Rate-limit AI endpoints per user. Never send phone numbers or addresses to the AI. Log failures and keep every feature working without AI.

## 7. Architecture and tech stack

| Layer | Choice |
| --- | --- |
| Backend | ASP.NET Core Web API on the latest LTS (.NET 10), layered: Api, Application, Domain, Infrastructure |
| Auth | ASP.NET Core Identity, JWT access tokens with refresh tokens, role claims |
| Database | PostgreSQL with EF Core (chosen because free hosted tiers are easy to get) |
| Validation and logging | FluentValidation, Serilog, global exception handler, Swagger |
| Background jobs | Hangfire with PostgreSQL storage |
| Real-time | SignalR for notifications \[P2\] |
| Payments | Razorpay test mode with webhook signature verification and idempotency |
| PDF | QuestPDF for invoices \[P2\] |
| Email | Brevo or Resend free tier |
| Images | Cloudinary free tier |
| AI | Gemini API free tier called from the backend |
| Frontend | React with Vite and TypeScript (see section 9) |
| Tests | xUnit, Moq, WebApplicationFactory integration tests |
| DevOps | Docker, GitHub Actions for build and test |

Suggested free hosting: frontend on Vercel or Netlify, API on Render (Docker) or Azure App Service with student credits, database on Neon or Supabase. Free tiers can sleep, which delays background jobs. Mitigation: ping the health endpoint with a free cron service and make the nightly job catch up on startup.

## 8. Data model (main entities)

- User, Role, CustomerProfile, Address
- Vendor (status, FSSAI, cutoff settings), ServiceArea, VendorServiceArea
- DeliveryPartner (linked to vendor)
- Dish (tags, allergens, price), DailyMenu and DailyMenuItem (date, slot)
- Plan (slots, duration, price per meal, skip credit percent)
- Subscription (customer, plan, weekdays, slots, address, start and end date, status)
- SubscriptionPause, MealSkip
- Order (date, slot, subscription, status, price) and DeliveryAssignment (partner, status, reason, photo)
- Wallet and WalletTransaction (append-only)
- Payment (Razorpay ids, status), Invoice
- Review, Complaint
- Notification, AuditLog, ForecastRecord (predicted versus actual)

## 9. Role-based access and security

- Use authorization policies per role. A vendor's identity comes from the token, never from the request body. Every vendor query filters by the logged-in vendor's id so one vendor can never read another's data. The same applies to customers and delivery partners.
- CORS allow-list, HTTPS only, secrets in environment variables, rate limiting on login and AI endpoints, input validation on every endpoint.
- Verify Razorpay webhook signatures. Use idempotency keys so a payment cannot credit the wallet twice.
- Audit log for approvals, refunds, role changes and cancellations.

## 10. Frontend design direction

The interface must feel like a real food product, not a generic AI template.

### 10.1 Avoid

Dark navy or purple gradients, neon glows, glassmorphism on everything, buttons that bounce or pulse, floating gradient blobs, emoji used as icons, placeholder text, and identical rounded cards repeated everywhere.

### 10.2 Visual language

- Warm light theme by default. Suggested palette (adjust after seeing it on screen): background cream #FAF6EF, surface white, ink #2B2118, primary terracotta #C2410C, secondary leaf green #2F6B3F, highlight turmeric #E9A23B, border #E7DFD1. A warm dark mode can come later; no blue-tinted dark mode.
- Typography: a serif for headings (Fraunces) and a clean sans for body (DM Sans or Inter), both free from Google Fonts. Clear size scale and generous spacing.
- Imagery: real food photography (free licensed sources) or consistent illustrations. Every dish card shows a photo, diet marker (veg or non-veg dot) and price.
- Motion: only functional. Use 150 to 200 ms transitions for hover, focus, dialogs and toasts, plus skeleton loaders. No looping animations. Optional Framer Motion for list and page transitions only.

### 10.3 Free libraries

Tailwind CSS, shadcn/ui (built on Radix), lucide-react icons, TanStack Query, TanStack Table, React Hook Form with Zod, Recharts, Sonner toasts, react-day-picker (meal calendar), date-fns, Leaflet with OpenStreetMap for any map.

### 10.4 Experience by role

- Customer and delivery partner: mobile-first, large tap targets, bottom navigation.
- Vendor and admin: desktop-first with a sidebar, data tables with search, filters and sort, and printable kitchen sheet.
- Required screens. Public: landing, vendor discovery, vendor page, login, register. Customer: home, subscribe flow, meal calendar, wallet, orders, complaints, profile. Vendor: dashboard, dishes, menu planner, plans, subscribers, kitchen sheet, earnings, reviews. Delivery: today's route, stop detail, summary. Admin: dashboard, vendor approvals, users, complaints, settings, audit log.
- Accessibility: AA colour contrast, visible focus states, keyboard navigation, labelled form fields.

## 11. Non-functional requirements

- Pages load in under 3 seconds on a normal mobile connection; list endpoints are paginated.
- All times stored in UTC and shown in IST.
- Nightly job completes in under a minute for 1,000 subscriptions.
- At least 60 percent test coverage on subscription, skip, pause, wallet and billing logic.
- Seed data script for demo: 3 vendors, 20 customers, 2 delivery partners, 1 admin.

## 12. How to use this PRD in Antigravity

1. Upload this document and ask Antigravity to produce an implementation plan before writing any code.
2. Work one module per chat in the order of the release plan, and commit after each module.
3. Save the design tokens in section 10 as a rules file so every frontend task follows them.
4. Ask for tests with each business-rule module, not at the end.
5. Do not let it add features outside this PRD. Write the skip, pause, wallet and billing logic yourself or review it line by line, since interviewers will ask about exactly that.

## 13. Definition of done

- Live frontend and API links, plus a demo login for each role.
- README with problem statement, architecture diagram, screenshots, setup steps and a section on business rules.
- Passing automated tests and a GitHub Actions badge.
- A 2 to 3 minute demo video.
- One resume line: Built a multi-role tiffin subscription platform (customer, vendor, delivery, admin) with JWT role-based authorization, scheduled order generation, wallet billing and AI-based demand forecasting.
