import type { ProductStateId } from '@/content/products';
import { AppFrame } from './AppFrame';
import ui from './ProductUi.module.css';
import styles from './AxloPosInterface.module.css';

/**
 * AxloPOS — three composed interface states.
 *
 * These replace the two branded placeholder PNGs that used to stand in for the
 * product (an empty frame with a teal header bar). They are built from the same
 * primitive kit as Comply360, in the Axlo palette, so the two products carry
 * equal visual weight instead of one being a real interface and the other an
 * empty rectangle.
 *
 * Being DOM rather than 2880×1360 PNGs also means: no image decode on the
 * critical path, no layout shift reserved for a frame, no lazy-loading logic,
 * and the interface text stays sharp and selectable-crisp at every zoom level.
 *
 * CONTENT POLICY
 * Currency is LKR, and every figure is illustrative demo data inside a frame
 * that says so. No customer, transaction or trading claim is made anywhere.
 */

/** Sri Lankan rupees, grouped — the currency the product actually trades in. */
function lkr(amount: number, withDecimals = true) {
  return `Rs ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  })}`;
}

/* --------------------------------------------------------------------------
   01 — POS checkout: product grid on the left, fixed cart on the right.
   -------------------------------------------------------------------------- */

const catalogue = [
  { name: 'Wall tile 300×600', sku: 'TIL-3060', price: 1250, swatch: 'a' },
  { name: 'Floor tile 600×600', sku: 'TIL-6060', price: 2180, swatch: 'b' },
  { name: 'Tile adhesive 20kg', sku: 'ADH-20', price: 1890, swatch: 'c' },
  { name: 'Grout white 5kg', sku: 'GRT-05W', price: 940, swatch: 'd' },
  { name: 'Spacer clips 2mm', sku: 'SPC-02', price: 320, swatch: 'e' },
  { name: 'Trowel notched', sku: 'TRW-N8', price: 1450, swatch: 'f' },
];

const cart = [
  { name: 'Wall tile 300×600', qty: 24, line: 30000 },
  { name: 'Tile adhesive 20kg', qty: 4, line: 7560 },
  { name: 'Grout white 5kg', qty: 2, line: 1880 },
];

/**
 * One bill, derived once.
 *
 * The checkout and the payment state are two views of the same transaction, so
 * their totals are computed here rather than typed into each screen. Anyone who
 * reads both — and on a carousel people do — sees the same numbers reconcile.
 */
const BILL = (() => {
  const subtotal = cart.reduce((total, item) => total + item.line, 0);
  const discount = 1970;
  const tax = Math.round((subtotal - discount) * 0.18);
  const due = subtotal - discount + tax;
  const cash = 25000;
  return { subtotal, discount, tax, due, cash, card: due - cash, tendered: 46000 };
})();

function SearchIcon() {
  return (
    <svg className={ui.searchIcon} viewBox="0 0 16 16" fill="none" focusable="false">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PosCheckout() {
  return (
    <AppFrame
      title="AxloPOS — Checkout"
      description="Conceptual view of the AxloPOS checkout screen: a searchable product grid of tile and hardware lines with prices in Sri Lankan rupees, beside a fixed cart showing three items with quantities, a subtotal, a discount, tax and the amount due, with a charge button."
      tone="flush"
    >
      <div className={styles.pos}>
        <div className={styles.posCatalogue}>
          <div className={ui.search}>
            <SearchIcon />
            Search products, SKU or barcode
          </div>

          <div className={styles.posTiles}>
            {catalogue.map((item) => (
              <div key={item.sku} className={styles.posTile}>
                <span className={styles.posSwatch} data-swatch={item.swatch} />
                <span className={styles.posTileName}>{item.name}</span>
                <span className={styles.posTileMeta}>
                  <span className={styles.posSku}>{item.sku}</span>
                  <span className={styles.posPrice}>{lkr(item.price, false)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.posCart}>
          <div className={styles.posCartHead}>
            <span className={ui.cardTitle}>Cart</span>
            <span className={ui.cardMeta}>Bill #4182</span>
          </div>

          <ul className={styles.posCartList}>
            {cart.map((item) => (
              <li key={item.name} className={styles.posCartRow}>
                <span className={styles.posQty}>{item.qty}×</span>
                <span className={styles.posCartName}>{item.name}</span>
                <span className={ui.amount}>{lkr(item.line, false)}</span>
              </li>
            ))}
          </ul>

          <dl className={styles.posTotals}>
            <div className={styles.posTotalRow}>
              <dt>Subtotal</dt>
              <dd>{lkr(BILL.subtotal)}</dd>
            </div>
            <div className={styles.posTotalRow}>
              <dt>Discount</dt>
              <dd data-tone="credit">−{lkr(BILL.discount)}</dd>
            </div>
            <div className={styles.posTotalRow}>
              <dt>Tax 18%</dt>
              <dd>{lkr(BILL.tax)}</dd>
            </div>
            <div className={styles.posTotalRow} data-total="true">
              <dt>Amount due</dt>
              <dd>{lkr(BILL.due)}</dd>
            </div>
          </dl>

          <div className={styles.posActions}>
            <span className={ui.actionQuiet}>Hold</span>
            <span className={ui.action}>Charge</span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------------------------------
   02 — Payment: tender split across methods, change due as it is entered.
   -------------------------------------------------------------------------- */

const methods = [
  { label: 'Cash', amount: BILL.cash, active: true },
  { label: 'Card', amount: BILL.card, active: false },
  { label: 'Wallet', amount: 0, active: false },
];

function PosPayment() {
  return (
    <AppFrame
      title="AxloPOS — Payment"
      description="Conceptual view of the AxloPOS payment screen: the amount due in Sri Lankan rupees, a tender split across cash, card and wallet, a numeric keypad, the amount tendered and the change due, with a complete-sale action."
    >
      <div className={ui.toolbar}>
        <span className={ui.context}>Bill #4182 · 3 items</span>
        <span className={ui.tabs}>
          <span className={ui.tab} data-active="true">
            Split payment
          </span>
          <span className={ui.tab}>Full amount</span>
        </span>
      </div>

      <div className={styles.payLayout}>
        <div className={styles.payDue}>
          <span className={styles.payDueLabel}>Amount due</span>
          <span className={styles.payDueValue}>{lkr(BILL.due)}</span>
          <span className={styles.payDueMeta}>Tiles &amp; hardware · Counter 2</span>
        </div>

        <div className={styles.payMethods}>
          {methods.map((method) => (
            <div key={method.label} className={styles.payMethod} data-active={method.active ? 'true' : undefined}>
              <span className={styles.payMethodLabel}>{method.label}</span>
              <span className={styles.payMethodValue}>{lkr(method.amount, false)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={ui.grid2}>
        <div className={styles.payKeypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((key) => (
            <span key={key} className={styles.payKey}>
              {key}
            </span>
          ))}
        </div>

        <div className={styles.paySummary}>
          <div className={styles.payLine}>
            <span>Tendered</span>
            <span className={ui.amount}>{lkr(BILL.tendered)}</span>
          </div>
          <div className={styles.payLine} data-emphasis="true">
            <span>Change due</span>
            <span className={ui.amount}>{lkr(BILL.tendered - BILL.due)}</span>
          </div>
          <span className={styles.payReceipt}>Receipt · Print and SMS</span>
          <span className={ui.action}>Complete sale</span>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------------------------------
   03 — Business dashboard: the day, the movers, the gaps, the sync.
   -------------------------------------------------------------------------- */

const topProducts = [
  { name: 'Floor tile 600×600', units: 148, value: 322640 },
  { name: 'Tile adhesive 20kg', units: 96, value: 181440 },
  { name: 'Wall tile 300×600', units: 84, value: 105000 },
];

const lowStock = [
  { name: 'Grout white 5kg', left: '6 left', tone: 'warn' as const },
  { name: 'Spacer clips 2mm', left: '14 left', tone: 'warn' as const },
  { name: 'Trowel notched', left: '3 left', tone: 'warn' as const },
];

const takings = [46, 58, 51, 67, 62, 78, 71, 86];

function PosDashboard() {
  return (
    <AppFrame
      title="AxloPOS — Business dashboard"
      description="Conceptual view of the AxloPOS owner dashboard: today's takings, transaction count and average basket in Sri Lankan rupees, a takings trend across the week, the three best-selling products by units and value, low-stock alerts, and an accounting sync status showing QuickBooks connected."
    >
      <div className={ui.toolbar}>
        <span className={ui.context}>Today · Colombo branch</span>
        <span className={ui.tabs}>
          <span className={ui.tab} data-active="true">
            Today
          </span>
          <span className={ui.tab}>Week</span>
          <span className={ui.tab}>Month</span>
        </span>
      </div>

      <div className={ui.statRow}>
        <div className={ui.stat}>
          <span className={ui.statValue}>{lkr(486350, false)}</span>
          <span className={ui.statLabel}>Takings today</span>
        </div>
        <div className={ui.stat}>
          <span className={ui.statValue}>132</span>
          <span className={ui.statLabel}>Transactions</span>
        </div>
        <div className={ui.stat}>
          <span className={ui.statValue}>{lkr(3684, false)}</span>
          <span className={ui.statLabel}>Average basket</span>
        </div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Best sellers</span>
            <span className={ui.cardMeta}>Units</span>
          </div>
          <ul className={ui.rows}>
            {topProducts.map((product) => (
              <li key={product.name} className={ui.row}>
                <span className={ui.pip} />
                <span className={ui.rowMain}>
                  <span className={ui.rowName}>{product.name}</span>
                  <span className={ui.rowSub}>{lkr(product.value, false)}</span>
                </span>
                <span className={ui.amount}>{product.units}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Low stock</span>
            <span className={ui.cardMeta}>Reorder</span>
          </div>
          <ul className={ui.rows}>
            {lowStock.map((item) => (
              <li key={item.name} className={ui.row}>
                <span className={ui.pip} data-tone={item.tone} />
                <span className={ui.rowMain}>
                  <span className={ui.rowName}>{item.name}</span>
                </span>
                <span className={ui.status} data-tone={item.tone}>
                  {item.left}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Takings this week</span>
            <span className={ui.cardMeta}>Mon–Today</span>
          </div>
          <div className={ui.bars}>
            {takings.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className={ui.bar}
                style={{ height: `${value}%` }}
                data-latest={index === takings.length - 1 ? 'true' : undefined}
              />
            ))}
          </div>
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Connected systems</span>
          </div>
          <ul className={ui.rows}>
            <li className={ui.row}>
              <span className={ui.pip} data-tone="ok" />
              <span className={ui.rowMain}>
                <span className={ui.rowName}>QuickBooks</span>
                <span className={ui.rowSub}>Synced 12 min ago</span>
              </span>
              <span className={ui.status} data-tone="ok">
                Connected
              </span>
            </li>
            <li className={ui.row}>
              <span className={ui.pip} />
              <span className={ui.rowMain}>
                <span className={ui.rowName}>Supplier orders</span>
                <span className={ui.rowSub}>2 awaiting delivery</span>
              </span>
              <span className={ui.status}>Open</span>
            </li>
          </ul>
        </div>
      </div>
    </AppFrame>
  );
}

const states: Record<string, () => React.ReactElement> = {
  'pos-checkout': PosCheckout,
  'pos-payment': PosPayment,
  'pos-dashboard': PosDashboard,
};

export function AxloPosInterface({ state }: { state: ProductStateId }) {
  const State = states[state];
  return State ? <State /> : null;
}
