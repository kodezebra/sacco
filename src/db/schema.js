import {
  sqliteTable,
  text,
  real,
  integer,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* =========================
   SACCO
========================= */

export const sacco = sqliteTable("sacco", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});

/* =========================
   MEMBERS
========================= */

export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  saccoId: text("sacco_id").notNull(),

  fullName: text("full_name").notNull(),
  phone: text("phone"),
  memberNumber: text("member_number").unique(),
  
  // New Fields
  address: text("address"),
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),

  status: text("status").default("active"),
  createdAt: text("created_at").notNull(),
});

/* =========================
   ASSOCIATIONS
========================= */

export const associations = sqliteTable("associations", {
  id: text("id").primaryKey(),
  saccoId: text("sacco_id").notNull(),

  name: text("name").notNull(),
  type: text("type"), // project | department | fleet
  status: text("status").default("active"),

  createdAt: text("created_at").notNull(),
});

/* =========================
   TRANSACTIONS (ALL MONEY)
========================= */

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),

  associationId: text("association_id").notNull(),

  type: text("type").notNull(), // income | expense
  category: text("category").notNull(),
  amount: integer("amount").notNull(),

  description: text("description"),
  date: text("date").notNull(),
});

/* =========================
   SHARES
========================= */

export const shares = sqliteTable("shares", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull(),

  amount: integer("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   SAVINGS (LIQUID)
========================= */

export const savings = sqliteTable("savings", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull(),

  type: text("type").notNull(), // deposit | withdrawal
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   LOANS
========================= */

export const loans = sqliteTable("loans", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull(),

  principal: integer("principal").notNull(),
  interestRate: real("interest_rate").notNull(),
  durationMonths: integer("duration_months").default(6),

  issuedDate: text("issued_date").notNull(),
  status: text("status").default("active"),
});

/* =========================
   LOAN PAYMENTS
========================= */

export const loanPayments = sqliteTable("loan_payments", {
  id: text("id").primaryKey(),
  loanId: text("loan_id").notNull(),

  amount: integer("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   STAFF (HR)
========================= */

export const staff = sqliteTable("staff", {
  id: text("id").primaryKey(),
  associationId: text("association_id").notNull(),

  fullName: text("full_name").notNull(),
  role: text("role"),
  salary: integer("salary"),

  status: text("status").default("active"),
});

/* =========================
   PAYROLL
========================= */

export const payroll = sqliteTable("payroll", {
  id: text("id").primaryKey(),

  staffId: text("staff_id").notNull(),
  transactionId: text("transaction_id").notNull(),

  amount: integer("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   RELATIONS
========================= */

export const saccoRelations = relations(sacco, ({ many }) => ({
  members: many(members),
  associations: many(associations),
}));

export const memberRelations = relations(members, ({ many }) => ({
  shares: many(shares),
  savings: many(savings),
  loans: many(loans),
}));

export const associationRelations = relations(associations, ({ many }) => ({
  transactions: many(transactions),
  staff: many(staff),
}));

export const loanRelations = relations(loans, ({ many }) => ({
  payments: many(loanPayments),
}));

export const staffRelations = relations(staff, ({ many }) => ({
  payroll: many(payroll),
}));

export const transactionRelations = relations(transactions, ({ many }) => ({
  payroll: many(payroll),
}));
