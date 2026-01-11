# Reports & Financial Statements

This document outlines the reporting engine requirements for the SACCO management system.

## 1. Core Reports

### A. Member Statement
*   **Purpose:** Provide a member with their full financial history.
*   **Scope:** Single member.
*   **Data:** All savings, shares, and loan payments associated with the member ID.
*   **Columns:** Date, Transaction Type, Debit, Credit, Running Balance.

### B. Loan Portfolio Report
*   **Purpose:** Assess the total lending risk.
*   **Scope:** Global.
*   **Data:** All loans where `status = 'active'`.
*   **Calculations:** Total Principal, Total Interest Due, Total Paid, Remaining Balance.

### C. Cash Flow Statement (Income Statement)
*   **Purpose:** Track profitability over a period.
*   **Scope:** Global (Date Range).
*   **Data:** Transactions grouped by category.
*   **Output:** Total Income (Deposits, Interest, Share Capital) vs Total Expenses (Withdrawals, Disbursements).

## 2. Implementation Strategy

### Routing
*   `/dashboard/reports`: Home center with links to specific report parameters.
*   `/dashboard/reports/[type]`: The generated report view.

### Format
*   **HTML:** Default view (Responsive table).
*   **Print:** CSS-optimized for A4 paper.
*   **CSV:** For Excel export.

## 3. Data Flow
1.  Admin selects Report Type and Parameters (e.g., Member ID or Date Range).
2.  Backend executes aggregate SQL queries using Drizzle.
3.  Frontend renders a "Printable" view using a specialized layout.