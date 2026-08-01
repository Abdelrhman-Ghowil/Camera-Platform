# Frontend Take-Home Requirements

## Project Overview

Build a React prototype for a multi-step bundle builder with a live review panel.

The app should recreate the provided Figma design as closely as possible and behave like a production-quality shopping configuration UI.

Figma design:
https://www.figma.com/design/JYf61etQVqeseX7oY5alGz/Frontend-Test-Figma?node-id=68-8088&t=eItHIh0U1JjjJF8d-1

## Core Experience

The page should use a two-column layout:

- Left column: bundle builder accordion.
- Right column: live review panel titled "Your security system".

On desktop, the layout, spacing, typography, colors, corner radii, and UI states should closely match the Figma design.

On smaller screens, the layout should remain usable and visually coherent down to phone sizes.

## Builder Accordion

The builder is a vertical 4-step accordion:

1. Choose your cameras
2. Choose your plan
3. Choose your sensors
4. Add extra protection

Step 1 should be expanded by default on initial page load.

Each accordion step header should include:

- A "STEP X OF 4" headline.
- An icon.
- The step title.
- A right-side state indicator.

Open step behavior:

- Shows an "N selected" count.
- Shows an up-chevron.
- Displays the step content.
- Ends with a "Next: ..." button that advances to the following step.

Collapsed step behavior:

- Shows a down-chevron.
- Hides the step content.

The "N selected" count should reflect the number of distinct products currently selected in that step.

## Product Cards

Product cards should be rendered from JSON data, not hardcoded one-by-one in markup.

Each card may include:

- Optional discount badge, such as "Save 22%".
- Product image.
- Product title.
- Short product description.
- "Learn More" link.
- Optional color or variant selector.
- Quantity stepper.
- Pricing.
- Optional compare-at price shown struck through.
- Active price.

Cards with quantity greater than zero should appear in a selected state using the highlighted border shown in the design.

Not every product has every field. Some products may have:

- No badge.
- No variants.
- Different pricing structure.
- Different imagery or descriptions.

The UI should reproduce the product-specific details shown in the design.

## Variant Selector

Products with variants should show a row of selectable color chips.

Each variant chip should include:

- A small swatch or thumbnail.
- A label matching the design.

Variant behavior:

- Each variant has its own independent quantity.
- The product card quantity stepper is bound to the currently selected variant.
- Switching variants should update the stepper to show that variant's quantity.
- Quantities for other variants should be preserved.

Example:

- Shopper adds 2 of Red.
- Shopper switches to Blue.
- Stepper now shows 0 for Blue.
- Red remains selected with quantity 2.
- Review panel still shows Red as a selected line item.

Products without variants should not render a variant selector.

Selected-chip styling is lower priority than correct selection and quantity behavior.

## Quantity Steppers

Quantity steppers must work on:

- Product cards.
- Review panel line items.

Stepper behavior:

- Increasing or decreasing quantity on a product card updates the review panel.
- Increasing or decreasing quantity in the review panel updates the product card.
- Product card and review panel quantities must stay in sync.
- Disabled states should be handled where appropriate, such as preventing quantity below zero.

## Review Panel

The review panel should update live as the shopper changes the configuration.

It should group selected items under these category headings:

- Cameras
- Sensors
- Accessories
- Plan

Each selected line item should include:

- Thumbnail.
- Name.
- Quantity stepper.
- Pricing.

For products with variants, each selected variant with quantity above zero should appear as its own line item.

Below the line items, the review panel should include:

- Shipping row.
- Satisfaction-guarantee badge.
- Financing line.
- Total.
- Pre-discount total shown struck through.
- Savings callout.
- Checkout button.
- "Save my system for later" link.

Checkout does not need to navigate anywhere. A placeholder action or simple confirmation is acceptable.

## Pricing And Totals

The total should recalculate whenever quantities change.

The review panel should display:

- Current total.
- Pre-discount total where applicable.
- Savings amount or savings callout.

Pricing should be derived from the JSON data and current selected quantities.

## Data Requirements

The app should be data-driven from a JSON source.

A local JSON file is acceptable.

The JSON data should define:

- Steps.
- Products.
- Product categories.
- Product images.
- Descriptions.
- Badges.
- Variants.
- Prices.
- Compare-at prices.
- Initial quantities or seeded selections.

The initial state should make the app load matching the design, including the review panel's pre-populated:

- Sensors.
- Accessory.
- Plan.

These pre-populated items may not have add controls in the current visible builder step, but they should still appear in the review panel.

Serving the JSON from a small backend or API is a bonus, not a requirement.

## Persistence

The "Save my system for later" link should persist the shopper's current configuration.

Expected behavior:

1. Shopper configures a system.
2. Shopper clicks "Save my system for later".
3. Shopper reloads the page or returns later.
4. The saved system is restored exactly as it was left.

Client-side persistence is acceptable. `localStorage` is the expected approach.

The saved configuration should preserve:

- Selected products.
- Selected variants.
- Variant-specific quantities.
- Non-variant product quantities.
- Plan and pre-populated selections.

## Responsiveness

Desktop should match the Figma design closely.

Smaller viewports should:

- Remain readable.
- Avoid overlapping content.
- Keep controls easy to use.
- Preserve all core functionality.
- Adapt the two-column layout appropriately for mobile.

## Deliverable

The final submission should be a public GitHub repository containing:

- React source code.
- JSON data source.
- Backend/API code if the optional bonus is implemented.
- Clear run instructions in the README.
- A short README section describing decisions, tradeoffs, or unfinished items.

The project should build and run from a clean clone.

## Acceptance Checklist

- React prototype is implemented.
- Desktop UI closely matches the Figma design.
- Mobile and smaller viewports are usable.
- Four-step accordion works.
- Step 1 is open on load.
- "Next" buttons advance through steps.
- Selected counts update correctly.
- Product cards render from JSON data.
- Product selected state appears when quantity is greater than zero.
- Variant selection works.
- Variant quantities are tracked independently.
- Product card and review panel steppers stay in sync.
- Review panel updates live.
- Review panel groups items by category.
- Totals recalculate correctly.
- Save-for-later persists configuration.
- Saved configuration restores after reload.
- Checkout has an acceptable placeholder behavior.
- README includes install and run instructions.
