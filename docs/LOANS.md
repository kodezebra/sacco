# Loan Workflow & Architecture

This document outlines the lifecycle of a loan within the system, from application to closure, mapping user actions to system states and database records.

## 1. Loan Lifecycle

### Phase 1: Creation (Origination)
*   **Context:** A member requests a loan.
*   **User Action:** Admin clicks "New Loan" on the Member Profile.
*   **Input Data:**
    *   **Principal:** The amount borrowed (e.g., 1,000,000 UGX).
    *   **Interest Rate:** Percentage (e.g., 5% per month).
    *   **Duration:** Term in months (e.g., 6 months).
    *   **Start Date:** Disbursement date.
*   **System Action:**
    *   Calculates `Total Due` = Principal + (Principal * Rate * Duration). *[Policy TBD: Flat vs Reducing Balance]*
    *   Creates a record in `loans` table with status `active`.
    *   (Optional) Creates a `transaction` record of type `expense` (Disbursement).

### Phase 2: Repayment (Servicing)
*   **Context:** Member pays back a portion of the loan.
*   **User Action:** Admin clicks "Repay" on a specific loan card.
*   **Input Data:**
    *   **Amount:** The amount paid (e.g., 200,000 UGX).
    *   **Date:** Payment date.
*   **System Action:**
    *   Creates a record in `loan_payments` table.
    *   Recalculates `Outstanding Balance` = `Total Due` - `Sum(Payments)`.
    *   Checks for closure conditions.

### Phase 3: Closure
*   **Trigger:** Automated check after a Repayment.
*   **Condition:** `Outstanding Balance` <= 0.
*   **System Action:**
    *   Updates `loans.status` from `active` to `paid` (or `closed`).
    *   (Optional) If overpaid, balance serves as a credit or savings deposit.

## 2. Database Schema

### `loans` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Text (PK) | Unique Loan ID |
| `memberId` | Text (FK) | Link to Member |
| `principal` | Integer | Original borrowed amount |
| `interestRate` | Real | Interest % (e.g., 0.05 for 5%) |
| `durationMonths` | Integer | Expected term |
| `issuedDate` | Text | ISO Date |
| `status` | Text | `active`, `paid`, `defaulted` |

### `loan_payments` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Text (PK) | Unique Payment ID |
| `loanId` | Text (FK) | Link to specific Loan |
| `amount` | Integer | Amount paid |
| `date` | Text | ISO Date |

## 3. Calculations

**Standard Flat Rate Model (Simple Interest):**
> *Simplest for SACCOs.*

*   **Total Interest** = `Principal` × `InterestRate` × `DurationMonths`
*   **Total Repayment Amount** = `Principal` + `Total Interest`
*   **Outstanding Balance** = `Total Repayment Amount` - `Sum(All Payments)`

*Example:*
*   Borrow: 1,000,000
*   Rate: 5% (0.05) per month
*   Term: 3 months
*   **Interest:** 1,000,000 * 0.05 * 3 = 150,000
*   **Total Due:** 1,150,000
