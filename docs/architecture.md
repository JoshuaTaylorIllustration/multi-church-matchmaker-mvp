# Matchmaker App Architecture

## 🎯 Product Overview

Matchmaker is an **event-first, faith-centered relationship platform**.

Users primarily enter the system through **real-world events** (via QR code), then move through a guided process:

Learn → Sign Up → Create Profile → Submit References → Participate in Matching

The system emphasizes:
- trust
- intentionality
- human-centered validation (references)
- structured interaction over casual browsing

---

## 👥 User Roles

### 1. User
Primary participant seeking a relationship.

**Capabilities:**
- Sign up and authenticate
- Complete profile
- Submit references
- Receive matches
- Interact with match flow

**Primary Routes:**
- `/dashboard`
- `/profile`
- `/matches`

---

### 2. Reference
A trusted person who provides validation for a user.

**Capabilities:**
- Submit a reference form
- Provide testimony or evaluation
- No full account required (lightweight access preferred)

**Primary Routes:**
- `/reference`

---

### 3. Area Director
Leader responsible for a specific geographic or community area.

**Capabilities:**
- Manage events
- Oversee users in their area
- Moderate participation quality
- Potentially approve users or references

**Primary Routes:**
- `/area`

---

### 4. Platform Admin
System-level administrator.

**Capabilities:**
- Manage all users
- Manage roles
- Monitor system health
- Moderate content globally

**Primary Routes:**
- `/admin`

---

## 🧭 Core App Areas

### 1. Event Entry (Public)
Entry point via QR code at a real-world event.

**Purpose:**
- Welcome users
- Explain the system
- Drive sign up or login

**Key Screen:**
- Event Landing Page (`/` or `/event`)

---

### 2. Authentication & Onboarding

**Purpose:**
- Create account
- Establish identity
- Begin user journey

**Includes:**
- Sign up
- Log in
- Email verification
- Terms acceptance

---

### 3. Profile Setup (Guided Flow)

**Purpose:**
- Collect structured user data
- Prepare user for matching

**Steps may include:**
- Contact info
- Personal details
- Testimony / background
- Photo upload
- Review step

**Pattern:**
- Multi-step form with tabs or progression

---

### 4. Reference System

**Purpose:**
- Validate users through trusted relationships

**Flow:**
- User submits reference contact(s)
- Reference receives link
- Reference completes form
- Data attaches to user profile

---

### 5. User Dashboard

**Purpose:**
- Central hub for user activity

**Includes:**
- Profile status
- Reference status
- Match status
- Next steps

---

### 6. Matching System (Future Phase)

**Purpose:**
- Deliver intentional matches

**Possible Features:**
- Scheduled match release (daily / biweekly)
- Approval workflow (optional)
- Guided communication

---

### 7. Admin & Moderation

**Purpose:**
- Maintain system quality and safety

**Includes:**
- User management
- Role assignment
- Content moderation
- System oversight

---

## 🧱 Shared System Components

### Authentication
- Supabase Auth
- Role-based routing
- Protected routes

### Role System
- Determines access to routes and features
- Stored in database and checked on login

### Profile Completion State
- Tracks progress through onboarding
- Used to gate access to matching

### Event Context
- Users may be tied to an event or area
- Influences onboarding and matching context

---

## 🧩 Frontend Structure (Next.js)

### App Router Structure (Conceptual)

```text
/app
  /page.tsx              → Event Landing
  /login
  /signup
  /dashboard
  /profile
  /reference
  /admin
  /area
