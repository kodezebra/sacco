# Associations (Strategic Business Units)

## Overview
In the SACCO context, **Associations** represent distinct operational branches, projects, or profit centers. Unlike a monolithic structure, this allows the SACCO to track financial performance (profitability) and human resources (staffing) for specific initiatives independently.

## Use Cases

### 1. Investment Projects
A SACCO often invests member savings into income-generating activities.
*   **Example:** "Maize Mill Project" or "Real Estate Development".
*   **Goal:** Track the specific income from sales vs. the expenses (maintenance, raw materials) to calculate Return on Investment (ROI).

### 2. Operational Departments
Distinct internal functions that have their own budgets.
*   **Example:** "Head Office" or "Field Outreach".
*   **Goal:** Monitor administrative costs (Salaries, Rent, Utilities) separate from project costs.

### 3. Asset Management (Fleet)
If the SACCO owns vehicles (Boda Bodas, Taxis, Trucks) for hire.
*   **Example:** "Toyota Hiace - UBA 123X".
*   **Goal:** Track fuel, repairs (Expenses) vs. daily fares (Income) to determine the net value of the asset.

## Data Structure

### Association Entity
*   **Name:** Identifier (e.g., "Kampala Branch").
*   **Type:** Categorization (Project, Department, Fleet).
*   **Status:** Active/Inactive.

### Related Entities
1.  **Staff:** Employees are assigned to a specific Association. Their salaries are expenses charged to that Association.
2.  **Transactions:** Every income or expense record is tagged with an `association_id`.

## Workflow

### 1. Creation
*   The Administrator defines a new Association (e.g., "Poultry Farm").
*   This creates a new "Ledger" effectively for that entity.

### 2. Staffing
*   Staff members are hired and assigned to the "Poultry Farm".
*   Payroll processing automatically deducts salaries from the "Poultry Farm" expense ledger.

### 3. Financial Tracking
*   **Expense:** Buying feeds/vaccines is recorded as a Transaction linked to "Poultry Farm".
*   **Income:** Selling eggs/chicken is recorded as a Transaction linked to "Poultry Farm".

### 4. Reporting
*   The Dashboard for Associations displays a P&L (Profit and Loss) statement for each unit.
*   Underperforming units (High Expense, Low Income) can be identified and restructured.

## User Interface

### List View
A grid of cards showing all Active Associations.
*   **Key Metrics:** Net Profit (Income - Expense), Staff Count.
*   **Visuals:** Color-coded status (Profitable = Green, Loss = Red).

### Detail View
A focused dashboard for a single Association.
*   **Transaction History:** Specific ledger for this unit.
*   **Staff Roster:** List of employees.
*   **Actions:** "Record Income" and "Record Expense" buttons that allow logging financial entries directly to the unit's ledger.

