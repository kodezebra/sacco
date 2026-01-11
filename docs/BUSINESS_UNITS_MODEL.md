# SACCO Operational Model: Business Units

To understand how **Associations (Business Units)** work in the application, it helps to look at how large organizations like construction firms or retail chains manage their operations.

The system is designed to split the SACCO into **Profit Centers** (units that make money) and **Cost Centers** (units that spend money), rather than treating it as one monolithic fund.

## Entity Relationships

### 1. The Core: Association (The Container)
Think of an Association as a **Project Folder** or a **Branch Office**.
*   **Concept:** It is the parent container for operations.
*   **Real World Analogy:** A Construction Company has "Project A (Road)" and "Project B (Bridge)".
*   **In The App:** You create a Unit named "Poultry Project".

### 2. Related Entity: Staff (The Cost Drivers)
Labor is often the primary operational cost. You need to know *who* is working *where*.
*   **Concept:** Staff members are resources assigned to a specific unit.
*   **Real World Analogy:** A Manager is assigned to the "Kampala Branch". His salary comes out of *Kampala's* budget, not the Head Office's.
*   **In The App:**
    *   When hiring Staff, you select their **Association**.
    *   *Example:* "John Doe" is hired as a Farm Hand for the "Poultry Project".
    *   **Impact:** John is now a human resource of that specific business unit.

### 3. Related Entity: Transactions (The Scorecard)
Every financial movement is tagged to a unit. This allows for granular profitability analysis.
*   **Concept:** Income and Expenses are linked to the Association ID.
*   **Real World Analogy:** When a restaurant chain buys potatoes, that cost is charged to *Store #5*, not the CEO's personal account.
*   **In The App:**
    *   **Income:** Selling eggs is recorded as a Transaction tagged to "Poultry Project".
    *   **Expense:** Buying feeds is recorded as a Transaction tagged to "Poultry Project".
    *   **Result:** The Dashboard calculates `Income - Expense = Net Profit` for that specific unit.

### 4. Related Entity: Payroll (The Bridge)
This is where Staff and Transactions interact.
*   **Concept:** Automated generation of expense records based on staff assignment.
*   **Real World Analogy:** At month-end, the "Departmental Wage Bill" is calculated.
*   **In The App:**
    *   When running payroll, the system identifies "John Doe" (Staff).
    *   It identifies his unit "Poultry Project" (Association).
    *   It creates a **Transaction** (Expense) specifically for "Poultry Project".
    *   **Result:** The "Poultry Project" profitability drops by the exact amount of John's salary.

## Operational Diagram

```mermaid
graph TD
    SACCO[SACCO Headquarters] --> UnitA[Unit: Poultry Farm]
    SACCO --> UnitB[Unit: Transport Fleet]

    subgraph "Profit Center: Poultry Farm"
    UnitA --> StaffA[Staff: John (Farm Hand)]
    UnitA --> TransA1[Transaction: Sold Eggs (+)]
    UnitA --> TransA2[Transaction: Bought Feed (-)]
    StaffA -.->|Payroll Run| TransA3[Transaction: Salary Expense (-)]
    end

    subgraph "Profit Center: Transport Fleet"
    UnitB --> StaffB[Staff: Mike (Driver)]
    UnitB --> TransB1[Transaction: Daily Fares (+)]
    StaffB -.->|Payroll Run| TransB2[Transaction: Salary Expense (-)]
    end
```
