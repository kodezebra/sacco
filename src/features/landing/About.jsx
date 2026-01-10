import PublicLayout from '../../layouts/PublicLayout.jsx';

export default function AboutPage() {
  return (
    <PublicLayout title="About Us">
      <div class="max-w-4xl mx-auto py-12 px-4 space-y-16">
        
        {/* About Section */}
        <section class="text-center space-y-4">
          <h1 class="text-4xl font-bold tracking-tight">About kzApp SACCO</h1>
          <p class="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We are dedicated to empowering our members through financial inclusion and sustainable growth. 
            Our platform simplifies SACCO management, making it easier to track savings, loans, and investments.
          </p>
        </section>

        <div class="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div class="card bg-base-100 shadow-xl border border-base-200">
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl mb-2">Our Mission</h2>
              <p class="text-slate-600">
                To provide affordable financial services and promote a savings culture that enhances 
                the socio-economic welfare of our members and the community.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div class="card bg-base-100 shadow-xl border border-base-200">
            <div class="card-body items-center text-center">
              <h2 class="card-title text-2xl mb-2">Our Vision</h2>
              <p class="text-slate-600">
                To be the leading SACCO in the region, recognized for financial stability, 
                transparency, and excellent member service.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values or Extra Info */}
        <section class="bg-base-200 rounded-2xl p-8 md:p-12">
          <h2 class="text-2xl font-bold mb-6 text-center">Core Values</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div class="p-4 bg-base-100 rounded-lg shadow-sm font-semibold">Integrity</div>
            <div class="p-4 bg-base-100 rounded-lg shadow-sm font-semibold">Innovation</div>
            <div class="p-4 bg-base-100 rounded-lg shadow-sm font-semibold">Accountability</div>
            <div class="p-4 bg-base-100 rounded-lg shadow-sm font-semibold">Teamwork</div>
          </div>
        </section>

      </div>
    </PublicLayout>
  );
}
