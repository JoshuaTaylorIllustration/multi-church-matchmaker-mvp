# Matchmaker – Codex Instructions

## Core Principle
This app prioritizes **clarity, warmth, and restraint**.
UI changes should feel intentional, minimal, and structured.

---

## 🔒 Visual Change Policy (VERY IMPORTANT)

When making UI changes:

- DO NOT redesign entire sections unless explicitly asked
- DO NOT replace illustrations or imagery
- DO NOT change layout hierarchy
- DO NOT compress or expand spacing arbitrarily

Instead:
- Make the **smallest possible change** to achieve the goal
- Preserve structure, spacing rhythm, and grouping
- Maintain visual consistency across screens

Before making changes, identify:
- What is changing
- What must remain untouched

---

## 🎯 Source of Truth

Always follow:

- `/docs/design-system.md` → spacing, typography, components
- Existing UI in the app → treat as canonical reference

If conflict exists:
1. Follow design-system.md
2. Then match existing UI patterns

---

## 📐 Spacing & Layout Rules (STRICT)

- Use ONLY these spacing values:
  `4, 8, 16, 20, 24, 32, 48, 64, 72, 80`

- Layout is based on a **64px root rhythm**
  - Major sections: 64px apart
  - Subsections: 32px or 24px
  - Tight groupings: 16px

- Group related items using whitespace, not borders

- Forms:
  - Fields spaced at **64px vertically**
  - Label to input: 8–12px
  - Section spacing must remain consistent

---

## ✍️ Typography Rules

- Heading:
  - 40px size
  - 48px line-height
  - Bold

- Subtitle (badge):
  - 16px
  - Bold

- Body text:
  - 16px
  - 24px line-height

- Button text:
  - 20px
  - Semi-bold

Do NOT introduce new arbitrary sizes.

---

## 🧱 Component Behavior

### Buttons
- Primary = yellow
- Secondary = neutral (gray/white)
- Large, clear tap targets
- Do not shrink buttons below visual weight of current UI

### Cards
- Centered content
- Strong internal padding
- Soft elevation
- Used as primary layout container

### Forms
- Clear vertical flow
- One primary action per section
- Strong spacing between fields (64px)
- No clutter

---

## 🎨 Visual Style

- Warm, human, welcoming
- Clean and minimal
- High readability
- Strong hierarchy through spacing

Avoid:
- Overly modern SaaS styling
- Heavy gradients
- Tiny text
- Overuse of shadows
- Dense layouts

---

## 🧠 Decision Framework

When unsure:

Ask:
- Does this improve clarity?
- Does this preserve spacing rhythm?
- Does this respect grouping?

If not → do not implement

---

## 📣 Output Expectations

When making UI changes:

- Explain:
  - What changed
  - What was preserved
  - Why the change improves the UI

- Reference affected components/files

---

## 🚫 Common Failure Modes to Avoid

- Replacing images when editing buttons
- Changing spacing inconsistently
- Introducing new font sizes
- Breaking vertical rhythm
- Over-designing simple screens
