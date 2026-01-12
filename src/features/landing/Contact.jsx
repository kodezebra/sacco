import PublicLayout from '../../layouts/PublicLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe } from 'lucide';

export default function ContactPage({ sacco }) {
  return (
    <PublicLayout title="Contact Us">
      <div class="bg-base-100 pb-32">
        {/* Header Section */}
        <section class="bg-slate-900 py-32 px-6">
          <div class="max-w-4xl mx-auto text-center space-y-6">
            <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter">We're here to help <br />you <span class="text-primary italic">succeed.</span></h1>
            <p class="text-xl text-slate-400 leading-relaxed">Questions about membership, loans, or technical support? Our expert team is ready to assist you.</p>
          </div>
        </section>

        <div class="max-w-7xl mx-auto px-6 -mt-16">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Contact Form */}
            <div class="lg:col-span-2 fintech-card overflow-hidden">
               <div class="bg-slate-900 p-10 text-white">
                  <h2 class="text-3xl font-black flex items-center gap-3">
                    <Icon icon={MessageSquare} size={28} class="text-primary" />
                    Direct Message
                  </h2>
                  <p class="text-slate-400 mt-2">Submit your inquiry and we'll get back to you within 24 hours.</p>
               </div>
               <div class="p-10">
                  <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div class="form-control w-full">
                      <label class="label">
                        <span class="label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest">Full Name</span>
                      </label>
                      <input type="text" placeholder="John Doe" class="input input-lg bg-slate-50 border-slate-200 w-full focus:bg-white rounded-2xl" />
                    </div>
                    
                    <div class="form-control w-full">
                      <label class="label">
                        <span class="label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest">Email Address</span>
                      </label>
                      <input type="email" placeholder="john@example.com" class="input input-lg bg-slate-50 border-slate-200 w-full focus:bg-white rounded-2xl" />
                    </div>
                  </div>

                  <div class="form-control w-full mb-10">
                    <label class="label">
                      <span class="label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest">Your Inquiry</span>
                    </label>
                    <textarea class="textarea textarea-lg bg-slate-50 border-slate-200 h-48 w-full focus:bg-white rounded-2xl" placeholder="How can we assist you today?"></textarea>
                  </div>

                  <button class="btn btn-primary btn-lg w-full rounded-2xl h-16 text-lg gap-3 shadow-xl shadow-primary/20">
                    <Icon icon={Send} size={20} />
                    Submit Inquiry
                  </button>
               </div>
            </div>

            {/* Support Info */}
            <div class="space-y-6">
              <div class="fintech-card p-8">
                 <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                       <Icon icon={Globe} size={24} />
                    </div>
                    <h3 class="text-xl font-black">Support Channels</h3>
                 </div>
                 
                 <div class="space-y-6">
                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icon icon={Mail} size={18} /></div>
                       <div>
                          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                          <p class="text-sm font-bold text-slate-700">{sacco?.email || 'support@sacco.com'}</p>
                       </div>
                    </div>

                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icon icon={Phone} size={18} /></div>
                       <div>
                          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Hotline</p>
                          <p class="text-sm font-bold text-slate-700">{sacco?.phone || 'Contact Support'}</p>
                       </div>
                    </div>

                    <div class="flex items-center gap-4">
                       <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icon icon={MapPin} size={18} /></div>
                       <div>
                          <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Physical Office</p>
                          <p class="text-sm font-bold text-slate-700">{sacco?.address || 'Main Office Location'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div class="fintech-card p-8 bg-slate-50 border-none">
                 <div class="flex items-center gap-4 mb-4">
                    <Icon icon={Clock} size={20} class="text-primary" />
                    <h4 class="font-black text-sm uppercase tracking-widest">Business Hours</h4>
                 </div>
                 <div class="space-y-2 text-sm text-slate-500 font-medium">
                    <div class="flex justify-between"><span>Monday - Friday</span> <span>8:00 AM - 5:00 PM</span></div>
                    <div class="flex justify-between"><span>Saturday</span> <span>9:00 AM - 1:00 PM</span></div>
                    <div class="flex justify-between text-error font-bold italic"><span>Sunday</span> <span>Closed</span></div>
                 </div>
              </div>

              <div class="card bg-primary p-8 rounded-3xl text-primary-content relative overflow-hidden shadow-2xl shadow-primary/20">
                 <div class="relative z-10">
                    <h4 class="font-black text-lg mb-2">Need immediate help?</h4>
                    <p class="text-xs opacity-80 mb-6 leading-relaxed">Access our comprehensive help center for guides on how to use the platform.</p>
                    <a href="/security" class="btn btn-secondary btn-sm rounded-xl px-6">View Security Info</a>
                 </div>
                 <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
