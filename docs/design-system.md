# Matchmaker Design System

## 🎯 Design Philosophy

This UI is built on:

- Strong vertical rhythm
- Clear grouping through whitespace
- Minimal visual noise
- Warm, welcoming tone

Whitespace is the primary tool for hierarchy.

---

## 📐 Spacing System (STRICT)

Allowed values:

`4, 8, 16, 20, 24, 32, 48, 64, 72, 80`

### Core Rhythm

- 64px = primary spacing unit
- 32px = subsection spacing
- 16px = tight grouping

### Usage

| Context | Spacing |
|--------|--------|
| Major sections | 64px |
| Between form fields | 64px |
| Card internal sections | 32px |
| Label to input | 8–12px |
| Title to subtitle | 16px |

### Rule

Never introduce new spacing values.

---

## 🔤 Typography

### Heading
- Size: 40px
- Line-height: 48px
- Weight: Bold

### Subtitle / Badge
- Size: 16px
- Weight: Bold
- Often paired with yellow background

### Body Text
- Size: 16px
- Line-height: 24px

### Button Text
- Size: 20px
- Weight: Semi-bold

---

## 🎨 Color System

### Primary Accent
- Yellow: `#FFED04`

### Neutrals
- Background: `#FFFFFF`
- Card background: `#F9F9F9` (or very light gray)
- Text primary: `#111111`
- Text secondary: `#555555`
- Borders: `#EAEAEA`

### Usage

- Yellow is used sparingly for emphasis
- Primary actions always use yellow
- Avoid multiple competing colors

---

## 🧱 Components

### Cards

Used as primary layout container.

- Centered
- Generous padding (32px+)
- Soft shadow
- Rounded corners

### Buttons

#### Primary
- Yellow background
- Strong visual weight
- Clear action

#### Secondary
- Neutral background
- Less emphasis

### Forms

- Vertical layout only
- No side-by-side fields unless necessary
- Large spacing (64px) between fields
- Clear labels above inputs

---

## 🧩 Layout Patterns

### Welcome Screen

Structure:

1. Subtitle badge (16px)
2. Heading (40px)
3. Supporting text
4. Illustration
5. Primary + secondary actions

Spacing:
- Tight top grouping (16px)
- Large separation before illustration (32–48px)
- Large separation before buttons (48–64px)

---

### Form Screen

Structure:

1. Subtitle badge
2. Heading
3. Tab navigation (if present)
4. Form fields
5. Primary action button

Spacing:
- Sections separated by 64px
- Fields separated by 64px

---

## ⚠️ Things to Avoid

- Tight stacking of elements
- Inconsistent spacing
- Multiple competing focal points
- Overly decorative UI
- Breaking vertical rhythm

---

## ✅ Definition of "Good"

A good screen:

- Feels calm
- Is easy to scan
- Has clear grouping
- Uses space intentionally
- Has one clear action

---

## 📌 Implementation Note

If unsure:
- Match existing screens exactly
- Reuse spacing and structure
- Do not invent new patterns
