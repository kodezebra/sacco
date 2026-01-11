# Dashboard & Analytics Workflow

This document outlines the requirements and data sources for the main Dashboard (`/dashboard`), which serves as the command center for the SACCO.

## 1. Core Metrics (KPIs)

The top of the dashboard will feature summary cards displaying key performance indicators (KPIs).

### A. Total Assets (Equity + Liabilities)
*   **Formula:** `Total Shares` + `Total Savings Balance`.
*   **Source Tables:** `shares`, `savings`.
*   **Meaning:** The total capital held by the SACCO.

### B. Loan Portfolio (Risk)
*   **Formula:** Sum of `Principal` for all loans where `status = 'active'`.
*   **Source Table:** `loans`.
*   **Meaning:** Total money currently lent out and at risk.

### C. Cash on Hand (Liquidity)
*   **Formula:** `Sum(Income Transactions)` - `Sum(Expense Transactions)`.
*   **Source Table:** `transactions`.
*   **Meaning:** Liquid cash available for new loans or withdrawals.

### D. Membership Growth
*   **Formula:** Count of all records in `members`.
*   **Source Table:** `members`.

## 2. Recent Activity Feed
A list of the 5-10 most recent transactions to give admins a quick pulse of what's happening.
*   **Columns:** Date, Member Name (if applicable), Type (Loan/Savings/Share), Amount.
*   **Source:** `transactions` (joined with `members`).

## 3. Visualizations (Charts) - *Future Phase*
*   **Income vs Expenses (Bar Chart):** Last 6 months.
*   **Portfolio Health (Pie Chart):** Active vs Overdue vs Paid Loans.

## 4. Implementation Plan

### Backend (`src/features/dashboard/index.js`)
1.  **Aggregated Queries:** Use `drizzle-orm` to perform `sum()` and `count()` queries across the 4 key tables.
2.  **Recent Activity:** Fetch the last 5 transactions with member names.
3.  **Optimization:** Run these queries in parallel (`Promise.all`) for speed.

### Frontend (`src/features/dashboard/Page.jsx`)
1.  **Stats Grid:** A responsive grid of 4 cards using DaisyUI `stats` component.
2.  **Activity Table:** A simplified version of the Global Transactions list.
3.  **Quick Actions:** Shortcuts to "New Member", "New Loan" (optional).
