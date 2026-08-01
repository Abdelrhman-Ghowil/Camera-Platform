# Security Bundle Builder

A React prototype for a multi-step home security bundle builder. The app lets shoppers configure cameras, plans, sensors and accessories while a live review panel updates quantities, grouped line items, savings and totals.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Features

- Four-step accordion builder with Step 1 open by default.
- Product cards rendered from JSON data rather than hardcoded markup.
- Live selected counts for each accordion step.
- Next buttons that advance through the builder.
- Variant selector support with independent quantities per variant.
- Quantity steppers on both product cards and review-panel line items.
- Shared state between the builder and review panel, keeping all steppers in sync.
- Review panel grouped by Cameras, Sensors, Accessories and Plan.
- Dynamic subtotal, compare-at total and savings calculations.
- Pre-populated starter configuration for sensors, accessory, camera and monitoring plan.
- `localStorage` save-for-later behavior.
- Responsive layout for desktop, tablet and mobile screen sizes.

## Data Model

The primary content source is:

```text
src/data/bundle.json
```

This file defines:

- Accordion steps.
- Product metadata.
- Categories used by the review panel.
- Product images.
- Descriptions and learn-more links.
- Badges.
- Variants and swatches.
- Prices and compare-at prices.
- Seeded initial quantities.

Products with variants store quantity by variant ID. Products without variants store a single quantity value.

## Persistence

Clicking `Save my system for later` saves the current configuration to `localStorage`. When the page is reloaded, the saved product quantities and selected variants are restored.

## Implementation Notes

- Built with React and Vite.
- Styling is plain CSS in `src/styles.css`.
- Figma-exported product artwork, icons and the satisfaction badge are stored locally in `public/assets/figma`.
- Checkout uses a lightweight placeholder confirmation.
- The implementation follows `requirment.md` and the reachable `Frontend Test Figma Copy` frames `1735` and `1736`.
