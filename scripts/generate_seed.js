const fs = require('fs');
const path = require('path');

// --- Helpers ---
const generateId = () => Math.random().toString(36).substring(2, 15);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// --- Data ---
const firstNames = [
  // Christian / English
  "John", "Mary", "Peter", "Paul", "Sarah", "James", "Grace", "David", 
  "Elizabeth", "Moses", "Esther", "Emmanuel", "Faith", "Patrick", "Peace",
  "Isaac", "Rebecca", "Samuel", "Joy", "Andrew", "Doreen", "Simon", "Rose",
  // Muslim
  "Mohammed", "Aisha", "Hassan", "Fatuma", "Hussein", "Zainab", "Abdul", 
  "Mariam", "Musa", "Sharifah", "Yusuf", "Hajat", "Umar", "Khadiijah", "Ismail",
  "Najat", "Sulaiman", "Ramathan", "Faridah", "Latif"
];
const lastNames = [
  "Kazibwe", "Tumusiime", "Baguma", "Komakech", "Okot", "Mutesi", 
  "Lubwama", "Sserwadda", "Nantume", "Kibuuka", "Ssemwogerere", "Namaganda",
  "Oryema", "Aketch", "Bukenya", "Walusimbi", "Ssekyanzi", "Nassiwa"
];

const generateName = () => `${randomItem(firstNames)} ${randomItem(lastNames)}`;

const generatePhone = () => {
  const prefixes = ['077', '078', '075', '070'];
  return `${randomItem(prefixes)}${randomInt(1000000, 9999999)}`;
};

// --- Generation Logic ---

const output = [];
const addSql = (sql) => output.push(sql);

// 1. Sacco
const saccoId = 'sacco-01';
addSql(`INSERT INTO sacco (id, name, created_at) VALUES ('${saccoId}', 'Pearl of Africa SACCO', '${formatDate(new Date('2025-01-01'))}');`);

// 2. Associations
const assocTypes = {
  bakery: { id: 'assoc-bakery', name: 'Golden Crust Bakery', type: 'project' },
  hatchery: { id: 'assoc-hatchery', name: 'Sunrise Hatchery', type: 'project' }
};

Object.values(assocTypes).forEach(assoc => {
  addSql(`INSERT INTO associations (id, sacco_id, name, type, created_at) VALUES ('${assoc.id}', '${saccoId}', '${assoc.name}', '${assoc.type}', '${formatDate(new Date('2025-01-01'))}');`);
});

// 4. Staff (10 Bakery, 10 Hatchery)
const staffIds = [];
const roles = ['Manager', 'Supervisor', 'Assistant', 'Cleaner', 'Baker'];

const createStaff = (assocId, count, rolePrefix, baseSalary) => {
  for (let i = 0; i < count; i++) {
    const id = generateId();
    staffIds.push({ id, assocId, salary: baseSalary });
    addSql(`INSERT INTO staff (id, association_id, full_name, role, salary) VALUES ('${id}', '${assocId}', '${generateName()}', '${rolePrefix}', ${baseSalary});`);
  }
};

createStaff(assocTypes.bakery.id, 10, 'Baker/Staff', 400000);
createStaff(assocTypes.hatchery.id, 10, 'Farm Hand', 350000);

// 5. Members (30 members)
const memberIds = [];
for (let i = 1; i <= 30; i++) {
  const id = `member-${i.toString().padStart(2, '0')}`;
  memberIds.push(id);
  const memberNum = `MBR${2025000 + i}`;
  const nextOfKin = generateName();
  const address = `Village ${randomItem(['A', 'B', 'C', 'D'])}, Zone ${randomInt(1, 5)}`;
  
  addSql(`INSERT INTO members (id, sacco_id, full_name, phone, member_number, address, next_of_kin_name, next_of_kin_phone, created_at) VALUES ('${id}', '${saccoId}', '${generateName()}', '${generatePhone()}', '${memberNum}', '${address}', '${nextOfKin}', '${generatePhone()}', '${formatDate(new Date('2025-01-15'))}');`);
}

// 6. Time Simulation
const startDate = new Date('2025-07-01');
const endDate = new Date('2025-12-31');
let currentDate = new Date(startDate);

while (currentDate <= endDate) {
  const dateStr = formatDate(currentDate);

  // ... (Association Transactions) ...

  // Bakery Sales
  if (Math.random() > 0.1) { 
    const amount = randomInt(200000, 800000);
    addSql(`INSERT INTO transactions (id, association_id, type, category, amount, description, date) VALUES ('${generateId()}', '${assocTypes.bakery.id}', 'income', 'sales', ${amount}, 'Daily Bread & Cake Sales', '${dateStr}');`);
  }
  // Bakery Expenses
  if (Math.random() > 0.7) {
    const amount = randomInt(50000, 200000);
    addSql(`INSERT INTO transactions (id, association_id, type, category, amount, description, date) VALUES ('${generateId()}', '${assocTypes.bakery.id}', 'expense', 'supplies', ${amount}, 'Flour, Sugar, Yeast', '${dateStr}');`);
  }

  // Hatchery Sales
  if (Math.random() > 0.2) {
    const amount = randomInt(150000, 600000);
    addSql(`INSERT INTO transactions (id, association_id, type, category, amount, description, date) VALUES ('${generateId()}', '${assocTypes.hatchery.id}', 'income', 'sales', ${amount}, 'Tray Sales (Eggs)', '${dateStr}');`);
  }
  // Hatchery Expenses
  if (Math.random() > 0.6) {
    const amount = randomInt(100000, 300000);
    addSql(`INSERT INTO transactions (id, association_id, type, category, amount, description, date) VALUES ('${generateId()}', '${assocTypes.hatchery.id}', 'expense', 'supplies', ${amount}, 'Chicken Feed', '${dateStr}');`);
  }

  // --- Shares & Savings (Member Activity) ---
  if (Math.random() > 0.4) {
    const member = randomItem(memberIds);
    // Shares
    if (Math.random() > 0.5) {
        const shareCount = randomInt(1, 3);
        const amount = shareCount * 50000; 
        addSql(`INSERT INTO shares (id, member_id, amount, date) VALUES ('${generateId()}', '${member}', ${amount}, '${dateStr}');`);
    }
    // Savings Deposit
    if (Math.random() > 0.3) {
        const amount = randomInt(10000, 100000);
        addSql(`INSERT INTO savings (id, member_id, type, amount, date) VALUES ('${generateId()}', '${member}', 'deposit', ${amount}, '${dateStr}');`);
    }
    // Savings Withdrawal
    if (Math.random() > 0.9) {
        const amount = randomInt(20000, 50000);
        addSql(`INSERT INTO savings (id, member_id, type, amount, date) VALUES ('${generateId()}', '${member}', 'withdrawal', ${amount}, '${dateStr}');`);
    }
  }

  // --- Monthly Payroll ---
  const nextDay = addDays(currentDate, 1);
  if (nextDay.getDate() === 1) { 
    staffIds.forEach(staff => {
      const transId = generateId();
      addSql(`INSERT INTO transactions (id, association_id, type, category, amount, description, date) VALUES ('${transId}', '${staff.assocId}', 'expense', 'payroll', ${staff.salary}, 'Salary Payment', '${dateStr}');`);
      addSql(`INSERT INTO payroll (id, staff_id, transaction_id, amount, date) VALUES ('${generateId()}', '${staff.id}', '${transId}', ${staff.salary}, '${dateStr}');`);
    });
  }

  currentDate = nextDay;
}

// 7. Loans
for(let i=0; i<5; i++) {
    const member = randomItem(memberIds);
    const loanId = generateId();
    const principal = randomInt(1000000, 5000000);
    const issueDate = '2025-08-15';
    const duration = 6;
    
    addSql(`INSERT INTO loans (id, member_id, principal, interest_rate, duration_months, issued_date, status) VALUES ('${loanId}', '${member}', ${principal}, 10.0, ${duration}, '${issueDate}', 'active');`);

    // Add a few payments
    addSql(`INSERT INTO loan_payments (id, loan_id, amount, date) VALUES ('${generateId()}', '${loanId}', ${Math.round(principal * 0.1)}, '2025-09-15');`);
    addSql(`INSERT INTO loan_payments (id, loan_id, amount, date) VALUES ('${generateId()}', '${loanId}', ${Math.round(principal * 0.1)}, '2025-10-15');`);
    addSql(`INSERT INTO loan_payments (id, loan_id, amount, date) VALUES ('${generateId()}', '${loanId}', ${Math.round(principal * 0.1)}, '2025-11-15');`);
}


fs.writeFileSync('seed.sql', output.join('\n'));
console.log('seed.sql generated with ' + output.length + ' lines.');
