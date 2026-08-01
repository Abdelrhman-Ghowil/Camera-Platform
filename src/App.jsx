import { useState } from "react";
import data from "./data/bundle.json";

const STORAGE_KEY = "security-bundle-builder:v1";
const CATEGORY_ORDER = ["Cameras", "Sensors", "Accessories", "Plan"];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2
  }).format(value);
}

function makeInitialQuantities() {
  const quantities = {};

  data.steps.forEach((step) => {
    step.products.forEach((product) => {
      if (product.variants) {
        quantities[product.id] = {};
        product.variants.forEach((variant) => {
          quantities[product.id][variant.id] = variant.initialQuantity || 0;
        });
      } else {
        quantities[product.id] = product.initialQuantity || 0;
      }
    });
  });

  return quantities;
}

function loadSavedQuantities() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.quantities || makeInitialQuantities();
  } catch {
    return makeInitialQuantities();
  }
}

function loadSavedVariants() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.selectedVariant || makeInitialVariants();
  } catch {
    return makeInitialVariants();
  }
}

function makeInitialVariants() {
  return Object.fromEntries(
    data.steps.flatMap((step) =>
      step.products.filter((product) => product.variants).map((product) => [product.id, product.variants[0].id])
    )
  );
}

function productQuantity(product, quantities) {
  const value = quantities[product.id];
  if (product.variants) {
    return Object.values(value || {}).reduce((sum, quantity) => sum + quantity, 0);
  }
  return value || 0;
}

function lineItems(quantities) {
  return data.steps.flatMap((step) =>
    step.products.flatMap((product) => {
      if (product.variants) {
        return product.variants
          .filter((variant) => (quantities[product.id]?.[variant.id] || 0) > 0)
          .map((variant) => ({
            id: `${product.id}:${variant.id}`,
            productId: product.id,
            variantId: variant.id,
            category: product.category,
            name: `${product.title} - ${variant.label}`,
            image: product.image,
            quantity: quantities[product.id][variant.id],
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            billingLabel: product.billingLabel,
            swatch: variant.swatch
          }));
      }

      const quantity = quantities[product.id] || 0;
      return quantity > 0
        ? [
            {
              id: product.id,
              productId: product.id,
              category: product.category,
              name: product.title,
              image: product.image,
              quantity,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              billingLabel: product.billingLabel
            }
          ]
        : [];
    })
  );
}

function Icon({ name }) {
  return <span className={`step-icon step-icon--${name}`} aria-hidden="true" />;
}

function QuantityStepper({ value, min = 0, onChange, compact = false }) {
  return (
    <div className={`stepper ${compact ? "stepper--compact" : ""}`} aria-label="Quantity selector">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        -
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}

function ProductCard({ product, quantities, selectedVariant, onSelectVariant, onSetQuantity }) {
  const totalQuantity = productQuantity(product, quantities);
  const currentVariant = product.variants?.find((variant) => variant.id === selectedVariant[product.id]);
  const currentQuantity = product.variants
    ? quantities[product.id]?.[currentVariant?.id] || 0
    : quantities[product.id] || 0;
  const min = product.lockedMinimum || 0;

  return (
    <article className={`product-card ${totalQuantity > 0 ? "is-selected" : ""}`}>
      {product.badge ? <div className="badge">{product.badge}</div> : null}
      <div className="product-card__media">
        <img src={product.image} alt="" />
      </div>
      <div className="product-card__body">
        <div>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>
        <a href={product.learnMoreUrl}>Learn More</a>
        {product.variants ? (
          <div className="variants" aria-label={`${product.title} variants`}>
            {product.variants.map((variant) => (
              <button
                type="button"
                key={variant.id}
                className={variant.id === currentVariant?.id ? "is-active" : ""}
                onClick={() => onSelectVariant(product.id, variant.id)}
              >
                <span style={{ background: variant.swatch }} />
                {variant.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="product-card__footer">
        <QuantityStepper value={currentQuantity} min={min} onChange={(next) => onSetQuantity(product, next, currentVariant?.id)} />
        <div className="price">
          {product.compareAtPrice ? <s>{money(product.compareAtPrice)}</s> : null}
          <strong>
            {money(product.price)}
            {product.billingLabel ? <span>{product.billingLabel}</span> : null}
          </strong>
        </div>
      </div>
    </article>
  );
}

function AccordionStep(props) {
  const { step, isOpen, selectedCount, children, onToggle, onNext } = props;

  return (
    <section className={`accordion-step ${isOpen ? "is-open" : ""}`}>
      <button className="accordion-step__header" type="button" onClick={onToggle} aria-expanded={isOpen}>
        <Icon name={step.icon} />
        <span className="accordion-step__copy">
          <span>STEP {step.step} OF 4</span>
          <strong>{step.title}</strong>
        </span>
        <span className="accordion-step__state">
          {isOpen ? `${selectedCount} selected` : ""}
          <span aria-hidden="true">{isOpen ? "⌃" : "⌄"}</span>
        </span>
      </button>
      {isOpen ? (
        <div className="accordion-step__content">
          <div className="product-grid">{children}</div>
          <button className="next-button" type="button" onClick={onNext}>
            {step.nextLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function ReviewPanel({ quantities, onSetLineQuantity, onSave, didSave, onCheckout }) {
  const items = lineItems(quantities);
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.category === category)
  })).filter((group) => group.items.length > 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const compareTotal = items.reduce((sum, item) => sum + (item.compareAtPrice || item.price) * item.quantity, 0);
  const savings = Math.max(0, compareTotal - subtotal);

  return (
    <aside className="review-panel">
      <div className="review-panel__heading">
        <span>Bundle review</span>
        <h2>Your security system</h2>
      </div>
      <div className="review-list">
        {grouped.map((group) => (
          <section key={group.category} className="review-group">
            <h3>{group.category}</h3>
            {group.items.map((item) => (
              <div className="review-item" key={item.id}>
                <img src={item.image} alt="" />
                <div className="review-item__main">
                  <strong>{item.name}</strong>
                  {item.swatch ? <span className="review-swatch" style={{ background: item.swatch }} /> : null}
                  <QuantityStepper
                    compact
                    value={item.quantity}
                    min={item.productId === "pro-monitoring" ? 1 : 0}
                    onChange={(next) => onSetLineQuantity(item, next)}
                  />
                </div>
                <div className="review-item__price">
                  <strong>
                    {money(item.price * item.quantity)}
                    {item.billingLabel ? <span>{item.billingLabel}</span> : null}
                  </strong>
                  {item.compareAtPrice ? <s>{money(item.compareAtPrice * item.quantity)}</s> : null}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className="review-summary">
        <div>
          <span>Shipping</span>
          <strong>Free</strong>
        </div>
        <div className="guarantee">60 day satisfaction guarantee</div>
        <p>As low as {money(Math.max(12, subtotal / 12))}/mo with flexible financing.</p>
        <div className="total-row">
          <span>Total</span>
          <strong>{money(subtotal)}</strong>
        </div>
        {savings > 0 ? (
          <div className="savings-row">
            <s>{money(compareTotal)}</s>
            <span>You save {money(savings)} today</span>
          </div>
        ) : null}
        <button className="checkout-button" type="button" onClick={onCheckout}>
          Checkout
        </button>
        <button className="save-link" type="button" onClick={onSave}>
          {didSave ? "System saved" : "Save my system for later"}
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  const [openStep, setOpenStep] = useState(data.steps[0].id);
  const [quantities, setQuantities] = useState(loadSavedQuantities);
  const [selectedVariant, setSelectedVariant] = useState(loadSavedVariants);
  const [didSave, setDidSave] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  function setProductQuantity(product, nextQuantity, variantId) {
    setQuantities((current) => {
      if (product.variants) {
        return {
          ...current,
          [product.id]: {
            ...current[product.id],
            [variantId]: nextQuantity
          }
        };
      }
      return { ...current, [product.id]: nextQuantity };
    });
    setDidSave(false);
  }

  function setLineQuantity(item, nextQuantity) {
    const product = data.steps.flatMap((step) => step.products).find((candidate) => candidate.id === item.productId);
    setProductQuantity(product, nextQuantity, item.variantId);
  }

  function saveSystem() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ quantities, selectedVariant }));
    setDidSave(true);
  }

  function checkout() {
    setCheckoutMessage("Your system is ready for checkout.");
    window.setTimeout(() => setCheckoutMessage(""), 2800);
  }

  function nextStep(currentStepId) {
    const currentIndex = data.steps.findIndex((step) => step.id === currentStepId);
    setOpenStep(data.steps[Math.min(currentIndex + 1, data.steps.length - 1)].id);
  }

  return (
    <main className="page-shell">
      <section className="builder">
        <div className="builder__intro">
          <p>Build your bundle</p>
          <h1>Customize your home security system</h1>
        </div>
        <div className="accordion">
          {data.steps.map((step) => (
            <AccordionStep
              key={step.id}
              step={step}
              isOpen={openStep === step.id}
              selectedCount={step.products.filter((product) => productQuantity(product, quantities) > 0).length}
              onToggle={() => setOpenStep(openStep === step.id ? "" : step.id)}
              onNext={() => nextStep(step.id)}
            >
              {step.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantities={quantities}
                  selectedVariant={selectedVariant}
                  onSelectVariant={(productId, variantId) => setSelectedVariant((current) => ({ ...current, [productId]: variantId }))}
                  onSetQuantity={setProductQuantity}
                />
              ))}
            </AccordionStep>
          ))}
        </div>
      </section>
      <ReviewPanel quantities={quantities} onSetLineQuantity={setLineQuantity} onSave={saveSystem} didSave={didSave} onCheckout={checkout} />
      {checkoutMessage ? <div className="toast">{checkoutMessage}</div> : null}
    </main>
  );
}
