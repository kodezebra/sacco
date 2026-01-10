import PublicLayout from '../../layouts/PublicLayout.jsx';

export default function LandingPage() {
  return (
    <PublicLayout title="Welcome">
      <div class="hero bg-base-200 py-20">
        <div class="hero-content text-center">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">kzApp SACCO</h1>
            <p class="py-6 text-slate-600">Manage your SACCO operations efficiently. Members, loans, shares, and more in one place.</p>
            <div class="flex gap-4 justify-center">
              <a href="/auth/login" class="btn btn-primary px-8">Get Started</a>
              <a href="/about" class="btn btn-outline px-8">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
