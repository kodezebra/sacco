import LegalLayout from '../../layouts/LegalLayout.jsx';

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" activeTab="privacy">
      <h1 class="text-3xl font-black tracking-tight mb-8">Privacy Policy</h1>
      
      <p class="lead text-lg text-slate-600 mb-8">
        Your privacy is paramount. This policy explains how kzApp SACCO collects, uses, and protects your personal and financial data in compliance with the Data Protection Act of Uganda.
      </p>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">1. Information We Collect</h2>
        <p>To provide our services, we collect information that identifies you as a member, including:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Identity Data:</strong> Full name, National ID number (NIN), date of birth, and photographs.</li>
          <li><strong>Contact Data:</strong> Phone numbers, residential address, and email address.</li>
          <li><strong>Financial Data:</strong> Income details, employment information, and bank account details.</li>
          <li><strong>Transactional Data:</strong> Details about payments, savings, and loan history on our platform.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">2. How We Use Your Data</h2>
        <p>We use your information strictly for the following purposes:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>To process membership applications and maintain your account.</li>
          <li>To assess creditworthiness and process loan applications.</li>
          <li>To facilitate savings deposits and withdrawals.</li>
          <li>To comply with regulatory requirements from the Bank of Uganda and other authorities.</li>
          <li>To prevent fraud and enhance the security of our services.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">3. Data Sharing</h2>
        <p>We do not sell your data. We only share information with third parties when necessary:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Credit Reference Bureaus (CRBs):</strong> For credit reporting as required by law.</li>
          <li><strong>Regulators:</strong> To comply with legal obligations and reporting requirements.</li>
          <li><strong>Service Providers:</strong> IT and payment processing partners who are contractually bound to protect your data.</li>
          <li><strong>Guarantors:</strong> Limited information regarding loan status in the event of default.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">4. Your Rights</h2>
        <p>Under the Data Protection Act, you have the right to:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of any inaccurate information.</li>
          <li>Object to the processing of your data for marketing purposes.</li>
          <li>Request the deletion of your data (subject to legal and regulatory retention requirements).</li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-4">5. Contact Our Data Officer</h2>
        <p>If you have any questions about this policy or our data practices, please contact us at:</p>
        <div class="bg-base-200 p-4 rounded-lg mt-4 font-mono text-sm">
          Email: privacy@kzapp-sacco.com<br />
          Phone: +256 700 000 000
        </div>
      </section>
    </LegalLayout>
  );
}
