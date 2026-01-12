import LegalLayout from '../../layouts/LegalLayout.jsx';

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" activeTab="terms">
      <h1 class="text-3xl font-black tracking-tight mb-8">Terms of Service</h1>
      
      <p class="lead text-lg text-slate-600 mb-8">
        By applying for membership or using any services provided by kzApp SACCO, you agree to be bound by these terms and conditions.
      </p>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">1. Membership Eligibility</h2>
        <p>Membership is open to individuals who meet our criteria as defined in our by-laws. To become a member, you must:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Be at least 18 years of age.</li>
          <li>Provide a valid National ID or Passport.</li>
          <li>Pay the non-refundable registration fee.</li>
          <li>Purchase the minimum required share capital.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">2. Share Capital & Savings</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Share Capital:</strong> Shares represent your ownership in the SACCO. Shares are non-withdrawable but may be transferred to another member upon approval.</li>
          <li><strong>Savings:</strong> Members must maintain a regular savings schedule. Interest on savings is determined annually by the Board.</li>
          <li><strong>Withdrawals:</strong> Savings withdrawals are subject to a notice period and must not fall below the minimum required balance.</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">3. Loans & Credit</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Loan eligibility is determined by your savings history and share capital.</li>
          <li>All loans are subject to an appraisal fee and must be backed by acceptable collateral or guarantors.</li>
          <li><strong>Default:</strong> Failure to repay a loan will result in penalties and recovery actions against collateral or guarantors. Defaults will be reported to Credit Reference Bureaus (CRBs).</li>
        </ul>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">4. Digital Platform Use</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity performed through your account is deemed to be authorized by you.</p>
      </section>

      <section class="mb-10">
        <h2 class="text-xl font-bold mb-4">5. Amendments</h2>
        <p>kzApp SACCO reserves the right to amend these terms at any time. Significant changes will be communicated to members via email or SMS.</p>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-4">6. Governing Law</h2>
        <p>These terms are governed by the laws of the Republic of Uganda. Any disputes shall be resolved through our internal dispute resolution mechanisms before seeking legal arbitration.</p>
      </section>
    </LegalLayout>
  );
}
