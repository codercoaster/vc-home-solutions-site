---
name: VC Home Solutions
description: A contractor's job board for Phoenix-valley homes, set in limewash paper, deep olive and ink.
colors:
  olive: "#3D4A2B"
  olive-mid: "#56653E"
  olive-deep: "#2C3620"
  on-olive: "#EEF0E4"
  on-olive-muted: "#C6CDB4"
  brass: "#8A6420"
  danger: "#A2381F"
  paper: "#F2EEE6"
  paper-shade: "#E7E1D5"
  sheet: "#FBF9F4"
  ink: "#1E1D19"
  ink-soft: "#45423A"
  muted: "#66625A"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(42px, 6.6vw, 84px)"
    fontWeight: 720
    lineHeight: 0.97
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.6vw, 60px)"
    fontWeight: 680
    lineHeight: 1.02
    letterSpacing: "-0.032em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  hairline: "2px"
  paper: "4px"
  pill: "999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "36px"
  section-mobile: "72px"
  section-desktop: "112px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.paper}"
    padding: "0 22px"
    height: "50px"
  button-ink-hover:
    backgroundColor: "{colors.olive}"
  button-olive:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.on-olive}"
    rounded: "{rounded.paper}"
    padding: "0 22px"
    height: "50px"
  button-olive-hover:
    backgroundColor: "{colors.olive-deep}"
  chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.on-olive}"
  work-order-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.paper}"
    padding: "32px 36px 36px"
---

# Design System: VC Home Solutions

## Overview

**Creative North Star: "The Job Board"**

The site is the contractor's own paperwork. Job files with spec sheets, a ruled scope-of-work list, a schedule board and a work order. Nothing is decoration: every surface is something a remodeling crew would actually hand a homeowner. The ground is limewash paper, the commitment colour is a deep olive that owns whole regions (the work-order field and the footer), and ink does the talking.

Density alternates like a studio-paced scroll: a dense job-file viewer, a quiet typographic list, an information-bearing schedule, a full-bleed photo band, then the work order. Real photography carries material texture; type carries everything else.

**Key Characteristics:**
- Paper, olive and ink; brass appears only as a stamp.
- One sans family (Bricolage Grotesque) at every size; mono only for numbers, measurements, job IDs and dates.
- Sharp paper corners, ruled lines, square drawn checkboxes.
- Before/after proof is the hero, not a picture of it.

## Colors

A restrained neutral paper with one committed field colour.

### Primary
- **Workshop Olive** (olive): owns the work-order section, selected chips, checked boxes, active filter underline, focus rings and the logo mark.
- **Field Olive** (olive-mid): schedule bars and hover on secondary olive surfaces.
- **Night Olive** (olive-deep): footer field and the olive button's hover.

### Tertiary
- **Stamp Brass** (brass): only the "Received" stamp. Never text, never a fill.

### Neutral
- **Limewash** (paper): page ground. Never pure white.
- **Shade Plaster** (paper-shade): image placeholders and schedule tracks.
- **Sheet** (sheet): paper objects that sit on the ground (estimate slip, work order, spec tags, slider knob).
- **Ink** (ink), **Soft Ink** (ink-soft), **Pencil** (muted): text tiers. Pencil is the lowest tier allowed for readable text.
- **Olive Paper** (on-olive, on-olive-muted): text on the olive field.

### Named Rules
**The Field Rule.** Olive commits at region scale (a whole section or footer) or at control scale (a chip, a box). Never as scattered accents on paper.
**The Brass Is a Stamp Rule.** Brass appears only where something has been officially received or signed off.

## Typography

**Display Font:** Bricolage Grotesque (system sans fallback)
**Body Font:** Bricolage Grotesque
**Label/Mono Font:** Geist Mono

**Character:** A grotesque named for handiwork, set heavy and tight for headlines and plain for reading; the mono reads like numbers stamped on a tag.

### Hierarchy
- **Display** (720, clamp 42–84px, 0.97): the hero H1 only, in explicit masked lines.
- **Headline** (680, clamp 34–60px, 1.02): section titles; scope trade names use the same voice at 30–46px.
- **Title** (650, 20–34px): spec-sheet titles, schedule tasks, work-order name.
- **Body** (400, 17px, 1.55): paragraphs capped at about 44–52ch.
- **Label** (Geist Mono 500, 10–13px, 0.1em uppercase for field names): spec keys, axis ticks, job and work-order numbers, dates.

### Named Rules
**The Measured Mono Rule.** Mono only carries numbers and measurements or the keys that label them. Never headlines, never body copy.
**The No Kicker Rule.** No eyebrow labels above headings; identifiers sit on the heading's line.

## Layout

A 1280px container with 20px (mobile) / 36px (≥900px) gutters. Sections breathe at 72px / 112px vertical padding, with section heads as a two-column row on desktop (title left, note right, bottom-aligned). The hero stage fills the viewport height on desktop (clamp 400–600px) so the estimate bar always sits above the fold. The job-file viewer is 8/4 (image / spec sheet), the scope list 7/5 with a sticky photo, the work order 5/7. Under 1000px every split stacks, images keep their aspect ratios, and horizontal strips scroll with snap.

## Elevation & Depth

Mostly flat paper separated by 1px rules. Lift is reserved for paper objects that sit on top of something: the estimate slip on the hero image, spec tags, the work order on the olive field.

### Shadow Vocabulary
- **Paper lift** (`0 1px 2px rgba(30,29,25,.06), 0 24px 48px -24px rgba(30,29,25,.35)`): slip, spec tag, toast.
- **Sheet on field** (`0 2px 4px rgba(0,0,0,.08), 0 40px 80px -40px rgba(0,0,0,.6)`): the work order on olive.

## Shapes

Paper corners (4px) on images, sheets and buttons; hairline corners (2px) on tags, bars and checkboxes; pills only for small selectable chips. Rules are 1px; emphasis rules (spec sheet top, work-order header) are 2px ink.

## Components

### Buttons
- **Shape:** paper corners (4px), 50px tall (40px small).
- **Ink:** ink on paper, hover to olive; the arrow nudges 3px right.
- **Olive:** on the work order; hover to night olive. Press scales to 0.97.
- **Line:** 1.5px current-colour outline for secondary actions.

### Chips
- **Style:** 1.5px pencil outline pill, 14px label. Selected: olive fill, olive-paper text, a check mark grows in from zero width.

### Inputs / Fields
- **Style:** underline only (1.5px), no box; notes field is a ruled paper area with 32px lines.
- **Focus:** underline turns olive and thickens; textarea rules turn olive.
- **Error:** underline and message in danger red; the field shakes once.

### Navigation
- Sticky paper bar with a bottom rule. Links in soft ink with a progressive underline that fills left→right on hover and stays under the section in view; phone number in mono; ink "Free estimate" button. Mobile: a sheet that unrolls with clip-path, links staggered in.

### Before/After Stage (signature)
Clip-path comparison with a paper knob; on load and on every job switch it wipes from all-before to the split with an exponential ease-out. Mono Before/After tags; the After tag follows the divider on the hero.

### Work Order (signature)
A sheet with a 2px ink header carrying "Work order", NO. and DATE in mono, underline fields, drawn square checkboxes and a ruled notes area. On submit: a brass "Received" stamp presses in (scale 1.7→1), followed by the summary.

## Do's and Don'ts

### Do:
- **Do** keep the ground limewash (paper) and put objects on it as sheets (sheet).
- **Do** use real photography for material texture; crop swatches from real photos rather than drawing textures.
- **Do** keep motion to the authored moments: the renovation wipe, schedule bars drawing in sequence, the stamp press.
- **Do** keep cursors to default, pointer on things that act, and text only inside typed fields.

### Don't:
- **Don't** add eyebrow labels, section numbers or icon-tile cards.
- **Don't** rotate or tilt icons and marks on hover.
- **Don't** use mono for anything that is not a number, measurement or its key.
- **Don't** put a one-sided coloured stripe on a rounded box.
