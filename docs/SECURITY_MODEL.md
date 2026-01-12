# Security & Role-Based Access Control (RBAC)

This document defines the security model for the SACCO management system.

## User Roles

The system supports 5 distinct roles, hierarchical in nature:

1.  **Super Admin** (`super_admin`)
    *   **Description:** The root user. Has unrestricted access to everything.
    *   **Key Powers:** Can delete other Admins, nuke the database (theoretically), and bypass all checks.

2.  **System Admin** (`admin`)
    *   **Description:** Technical administrator responsible for system access and configuration.
    *   **Key Powers:**
        *   Create/Delete User Accounts (Grant Access).
        *   Reset Passwords.
        *   Delete Member Records (Data Correction).
        *   Full access to all financial modules.

3.  **Manager** (`manager`)
    *   **Description:** Operational leader (e.g., Branch Manager, Head of Credit).
    *   **Key Powers:**
        *   **HR:** Hire and Edit Staff details (but cannot grant login access).
        *   **Operations:** Approve Loans, Record Transactions, Create Business Units.
        *   **Reporting:** View all sensitive reports.

4.  **Auditor** (`auditor`)
    *   **Description:** External or internal compliance officer.
    *   **Key Powers:**
        *   **Read-Only:** Can view Reports, Export CSVs, and browse all data.
        *   **No Write:** Cannot change data or approve loans.

5.  **Staff** (`staff`)
    *   **Description:** Standard employee (e.g., Teller, Field Officer).
    *   **Key Powers:**
        *   **View:** Can browse Members and Staff directory.
        *   **Limited Write:** Can record **Savings Deposits** (Teller function).
        *   **Blocked:** Cannot Withdraw, Issue Loans, Buy Shares, or View Sensitive Reports.

## Permissions Matrix

| Feature | Action | Super Admin | Admin | Manager | Auditor | Staff |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Auth** | Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| **System** | Grant/Revoke User Access | ✅ | ✅ | ❌ | ❌ | ❌ |
| **HR** | Hire/Edit Staff | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Members** | View List | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Members** | Create Member | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Members** | Update Member | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Members** | Delete Member | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Members** | Export CSV | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Finance** | Savings Deposit | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Finance** | Savings Withdraw | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Finance** | Issue Loan | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Finance** | Record Repayment | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Finance** | Buy Shares | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Ops** | Create Business Unit | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Ops** | Record Transaction | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Reports** | View Reports | ✅ | ✅ | ✅ | ✅ | ❌ |

## Technical Implementation

Security is enforced via the `roleGuard` middleware in `src/features/auth/middleware.js`.

```javascript
// Example: Protecting a sensitive route
app.post('/delete', roleGuard(['super_admin', 'admin']), async (c) => { ... });
```

If a user tries to access a route they are not authorized for, the server responds with a `403 Forbidden` HTML page.
