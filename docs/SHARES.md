# Shares Management Workflow

This document outlines the lifecycle of member shares (equity) within the SACCO system.

## 1. Concept: Share Capital
Shares represent a member's ownership in the SACCO. Unlike savings, share capital is generally **non-withdrawable** and serves as the permanent capital base of the organization.

### Key Characteristics:
*   **Purpose:** Funding SACCO operations and determining loan eligibility (e.g., 3x Shares limit).
*   **Earnings:** Members earn dividends based on the annual profit of the SACCO.
*   **Liquidity:** Low. Shares are usually only retrieved via transfer to another member upon exiting the SACCO.

## 2. Share Lifecycle

### Phase 1: Purchase (Investment)
*   **Context:** A member wants to join the SACCO or increase their ownership.
*   **User Action:** Admin clicks "Buy Shares" on the Member Profile.
*   **Input Data:**
    *   **Amount:** The UGX value of shares being purchased.
    *   **Date:** Transaction date.
*   **System Action:**
    *   Creates a record in the `shares` table.
    *   Creates a corresponding `transaction` record (Type: `income`, Category: `Share Capital`).
    *   Updates the member's "Total Shares" statistic.

### Phase 2: Monitoring (Global Overview)
*   **Context:** Admin wants to see total equity raised.
*   **User Action:** View the Global Shares List.
*   **System Action:** Displays all share investments, filterable by member or date.

### Phase 3: Dividends (Future Phase)
*   **Context:** Annual profit distribution.
*   **System Action:** Calculates `(Member Shares / Total SACCO Shares) * Profit Pool`.

## 3. Database Schema

### `shares` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Text (PK) | Unique Share ID |
| `memberId` | Text (FK) | Link to Member |
| `amount` | Integer | Value of shares purchased |
| `date` | Text | ISO Date (YYYY-MM-DD) |

## 4. Business Rules
1.  **Non-Withdrawable:** No withdrawal interface will be provided for shares.
2.  **Transaction Linking:** Every share purchase MUST generate a global transaction entry for accounting integrity.
3.  **Flat Value:** Shares are currently tracked by UGX value (Simple Model).
