import MainLayout from '../../layouts/MainLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide';

export default function LoginPage({ error }) {
  return (
    <MainLayout title="Sign In">
      <div class="min-h-screen flex items-center justify-center bg-whiten p-6">
        <div class="w-full max-w-md">
          {/* Logo / Brand */}
          <div class="text-center mb-10">
            <a href="/" class="inline-flex items-center gap-2 text-3xl font-black tracking-tighter text-black mb-2">
              <div class="w-12 h-12 rounded-sm bg-primary flex items-center justify-center text-white shadow-default">
                <span class="text-2xl font-black">S</span>
              </div>
              <span>SACCO<span class="text-primary">Admin</span></span>
            </a>
            <p class="text-body font-medium">Administrator Access Portal</p>
          </div>

          <div class="rounded-sm border border-stroke bg-white shadow-default overflow-hidden">
            {error && (
              <div class="bg-red-50 border-b border-red-100 p-4 flex items-center gap-3 text-red-500 text-sm font-bold">
                <Icon icon={AlertCircle} size={18} />
                {error}
              </div>
            )}
            
            <div class="p-8 sm:p-11">
              <h2 class="text-2xl font-bold text-black mb-1.5">Welcome Back</h2>
              <p class="text-sm text-body mb-8 font-medium">Please enter your credentials to continue.</p>

              <form action="/auth/login" method="post" class="space-y-5.5">
                <div>
                  <label class="mb-2.5 block font-bold text-black uppercase text-[11px] tracking-widest">Email or Phone</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      name="identifier"
                      placeholder="e.g. 0703625588" 
                      class="w-full rounded-sm border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none" 
                      required 
                      autofocus
                    />
                    <span class="absolute right-4 top-4 text-bodydark2">
                       <Icon icon={User} size={22} />
                    </span>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2.5">
                    <label class="block font-bold text-black uppercase text-[11px] tracking-widest">Password</label>
                    <a href="/contact" class="text-[11px] font-bold text-primary hover:underline uppercase tracking-widest">Help?</a>
                  </div>
                  <div class="relative">
                    <input 
                      type="password" 
                      name="password"
                      placeholder="••••••••" 
                      class="w-full rounded-sm border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none" 
                      required 
                    />
                    <span class="absolute right-4 top-4 text-bodydark2">
                       <Icon icon={Lock} size={22} />
                    </span>
                  </div>
                </div>

                <div class="pt-2">
                  <button class="flex w-full justify-center rounded-sm bg-primary p-3 font-bold text-white hover:bg-opacity-90 transition-all gap-3 shadow-default">
                    Sign In
                    <Icon icon={ArrowRight} size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-8 text-center">
             <p class="text-xs text-body font-medium">
               Authorized personnel only. For tech support, contact <br />
               <a href="mailto:support@saccoadmin.com" class="text-primary hover:underline">support@saccoadmin.com</a>
             </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

