# Savings Management Workflow

This document outlines the lifecycle of member savings (deposits and withdrawals) within the SACCO system.

## 1. Concept: Voluntary Savings
Savings represent liquid funds deposited by members. Unlike shares, these funds can be withdrawn by the member upon request, subject to SACCO liquidity and policy.

### Key Characteristics:
*   **Liquidity:** High. Members can deposit and withdraw.
*   **Interest:** (Optional) Some SACCOs pay interest on savings balance.
*   **Collateral:** Savings often act as collateral for loans (e.g., you can borrow up to 3x your savings).

## 2. Savings Lifecycle

### Phase 1: Deposit (Inflow)
*   **Context:** Member adds money to their account.
*   **User Action:** Admin clicks "Deposit" on Member Profile.
*   **Input:** Amount, Date.
*   **System Action:**
    *   Creates `savings` record (Type: `deposit`).
    *   Creates `transaction` record (Type: `income`, Category: `Savings Deposit`).
    *   Updates Member's "Savings Balance".

### Phase 2: Withdrawal (Outflow)
*   **Context:** Member requests to take money out.
*   **User Action:** Admin clicks "Withdraw" on Member Profile.
*   **Input:** Amount, Date.
*   **Validation:** `Amount <= Current Savings Balance`. (Cannot withdraw more than you have).
*   **System Action:**
    *   Creates `savings` record (Type: `withdrawal`).
    *   Creates `transaction` record (Type: `expense`, Category: `Savings Withdrawal`).
    *   Updates Member's "Savings Balance".

### Phase 3: Monitoring
*   **Context:** Admin reviews total liquidity.
*   **User Action:** View Global Savings List (or Dashboard Stats).

## 3. Database Schema

### `savings` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Text (PK) | Unique ID |
| `memberId` | Text (FK) | Link to Member |
| `type` | Text | `deposit` OR `withdrawal` |
| `amount` | Integer | Value |
| `date` | Text | ISO Date |

## 4. Calculations

*   **Net Savings Balance** = `Sum(Deposits)` - `Sum(Withdrawals)`
*   **Withdrawal Limit** = `Net Savings Balance` (Simple Model) OR `Net Balance - Locked Collateral` (Advanced Model - *Out of Scope for now*).
