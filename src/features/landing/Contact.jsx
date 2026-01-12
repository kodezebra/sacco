import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide';

export default function ContactPage() {
  return (
    <PublicLayout title="Contact Us">
      <div class="bg-base-100 py-16 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-4xl font-bold mb-4">Get in Touch</h1>
            <p class="text-slate-500 max-w-2xl mx-auto">Have questions about our services or need assistance with your account? Our team is here to help.</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div class="card bg-base-100 border border-base-200 shadow-xl overflow-hidden">
               <div class="bg-primary p-8 text-primary-content">
                  <h2 class="text-2xl font-bold flex items-center gap-2">
                    <Icon icon={MessageSquare} size={24} />
                    Send us a Message
                  </h2>
                  <p class="opacity-80 mt-1">We typically respond within 24 hours.</p>
               </div>
               <div class="card-body p-8 gap-6">
                  <div class="form-control w-full">
                    <label class="label">
                      <span class="label-text font-bold">Full Name</span>
                    </label>
                    <input type="text" placeholder="John Doe" class="input input-bordered w-full focus:input-primary" />
                  </div>
                  
                  <div class="form-control w-full">
                    <label class="label">
                      <span class="label-text font-bold">Email Address</span>
                    </label>
                    <input type="email" placeholder="john@example.com" class="input input-bordered w-full focus:input-primary" />
                  </div>

                  <div class="form-control w-full">
                    <label class="label">
                      <span class="label-text font-bold">Message</span>
                    </label>
                    <textarea class="textarea textarea-bordered h-32 focus:textarea-primary" placeholder="How can we help you?"></textarea>
                  </div>

                  <button class="btn btn-primary w-full gap-2 text-lg">
                    <Icon icon={Send} size={20} />
                    Send Message
                  </button>
               </div>
            </div>

            {/* Info Cards */}
            <div class="flex flex-col gap-6">
              <div class="card bg-base-200 shadow-sm border border-base-300">
                <div class="card-body flex-row items-center gap-6">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon icon={Mail} size={24} />
                  </div>
                  <div>
                    <h3 class="font-bold">Email Us</h3>
                    <p class="text-slate-500">support@kzapp-sacco.com</p>
                  </div>
                </div>
              </div>

              <div class="card bg-base-200 shadow-sm border border-base-300">
                <div class="card-body flex-row items-center gap-6">
                  <div class="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                    <Icon icon={Phone} size={24} />
                  </div>
                  <div>
                    <h3 class="font-bold">Call Us</h3>
                    <p class="text-slate-500">+256 700 000 000</p>
                  </div>
                </div>
              </div>

              <div class="card bg-base-200 shadow-sm border border-base-300">
                <div class="card-body flex-row items-center gap-6">
                  <div class="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
                    <Icon icon={MapPin} size={24} />
                  </div>
                  <div>
                    <h3 class="font-bold">Visit Office</h3>
                    <p class="text-slate-500">Plot 45, Kampala Road, Kampala, Uganda</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div class="card bg-slate-100 border border-base-200 overflow-hidden h-64 relative group grayscale hover:grayscale-0 transition-all duration-500">
                 <div class="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                    Map Preview
                 </div>
                 <div class="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg border border-slate-200">
                    <p class="text-xs font-bold text-slate-800">Headquarters</p>
                    <p class="text-[10px] text-slate-500">Kampala Central Business District</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
