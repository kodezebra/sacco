# Staff & User Management Workflow

This document outlines the workflow for managing Staff members and provisioning their User accounts (System Access).

## Overview

The system distinguishes between **Staff** (HR Records) and **Users** (System Logins).
- **Staff**: Represents a physical employee, their role, salary, and department assignment.
- **User**: Represents a login credential (Username/Password) linked to a specific Staff member.

---

## Roles & Permissions

Management actions are restricted to specific roles to ensure security.

| Action | Allowed Roles | Description |
| :--- | :--- | :--- |
| **View Staff List** | All Authenticated Users | Everyone can view the directory. |
| **Hire / Edit Staff** | `super_admin`, `admin`, `manager` | Manage HR records (Salary, Role, Unit). |
| **Grant / Manage Access** | `super_admin`, `admin` | Create or Modify User accounts (Login credentials). |

> **Note:** Managers can manage *employees*, but they cannot create *system logins*. Only Admins can grant system access.

---

## Workflows

### 1. Hiring New Staff (HR Record)
**Role Required:** Manager, Admin, or Super Admin.

1. Navigate to **Staff / HR** in the sidebar.
2. Click the **Hire Staff** button (Top Right).
3. Fill in the details:
   - **Full Name**: Legal name.
   - **Role/Title**: Job title (e.g., "Accountant").
   - **Business Unit**: The department/project they belong to.
   - **Salary**: Monthly compensation in UGX.
4. Click **Complete Hiring**.

### 2. Granting System Access (User Account)
**Role Required:** Admin or Super Admin.

1. Navigate to **Staff / HR**.
2. Locate the employee in the list.
3. Click the **Access** (Lock Icon) button.
   - *This button is only visible if the employee does NOT yet have an account.*
4. Fill in the credentials:
   - **Identifier**: Unique Login ID (Email or Phone Number).
   - **Password**: Initial password (min 8 chars).
   - **System Role**:
     - `Staff`: Standard access (View only / Limited input).
     - `Manager`: Can approve, edit, and manage others.
     - `Admin`: System operations (User management, etc.).
     - `Auditor`: Read-only access to everything.
     - `Super Admin`: Full system control (Reserved).
5. Click **Create Account**.

### 3. Managing Existing Users (Password Reset & Roles)
**Role Required:** Admin or Super Admin.

1. Navigate to **Staff / HR**.
2. Locate the employee.
3. Click the **Auth** (User Cog Icon) button.
4. **Update Role**: Select a new role from the dropdown.
5. **Reset Password**: Enter a new password in the field.
6. Click **Update Account**.

### 4. Revoking Access (Deleting User)
**Role Required:** Admin or Super Admin.

1. Open the **Manage User** dialog (Auth button).
2. Scroll to the "Danger Zone".
3. Click **Revoke Access**.

---

## Technical Notes

- **Password Security**: Passwords are hashed using **PBKDF2** (SHA-256).
- **Validation**: Strict validation rules apply to all inputs (e.g. valid email, min password length).
