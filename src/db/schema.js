import {
  sqliteTable,
  text,
  real,
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
  amount: real("amount").notNull(),

  description: text("description"),
  date: text("date").notNull(),
});

/* =========================
   SHARES
========================= */

export const shares = sqliteTable("shares", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull(),

  amount: real("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   LOANS
========================= */

export const loans = sqliteTable("loans", {
  id: text("id").primaryKey(),
  memberId: text("member_id").notNull(),

  principal: real("principal").notNull(),
  interestRate: real("interest_rate").notNull(),

  issuedDate: text("issued_date").notNull(),
  status: text("status").default("active"),
});

/* =========================
   LOAN PAYMENTS
========================= */

export const loanPayments = sqliteTable("loan_payments", {
  id: text("id").primaryKey(),
  loanId: text("loan_id").notNull(),

  amount: real("amount").notNull(),
  date: text("date").notNull(),
});

/* =========================
   FLEETS
========================= */

export const fleets = sqliteTable("fleets", {
  id: text("id").primaryKey(),
  associationId: text("association_id").notNull(),

  name: text("name").notNull(),
  identifier: text("identifier"),
  status: text("status").default("active"),
});

/* =========================
   STAFF (HR)
========================= */

export const staff = sqliteTable("staff", {
  id: text("id").primaryKey(),
  associationId: text("association_id").notNull(),

  fullName: text("full_name").notNull(),
  role: text("role"),
  salary: real("salary"),

  status: text("status").default("active"),
});

/* =========================
   PAYROLL
========================= */

export const payroll = sqliteTable("payroll", {
  id: text("id").primaryKey(),

  staffId: text("staff_id").notNull(),
  transactionId: text("transaction_id").notNull(),

  amount: real("amount").notNull(),
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
  loans: many(loans),
}));

export const associationRelations = relations(associations, ({ many }) => ({
  transactions: many(transactions),
  fleets: many(fleets),
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
