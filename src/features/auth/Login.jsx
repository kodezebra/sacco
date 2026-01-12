import MainLayout from '../../layouts/MainLayout.jsx';
import Icon from '../../components/Icon.jsx';
import { Lock, User, ArrowRight, AlertCircle } from 'lucide';

export default function LoginPage({ error }) {
  return (
    <MainLayout title="Sign In">
      <div class="min-h-screen flex items-center justify-center bg-base-200/50 p-6 selection:bg-primary/10 selection:text-primary">
        <div class="w-full max-w-md">
          {/* Logo / Brand */}
          <div class="text-center mb-10">
            <a href="/" class="inline-flex items-center gap-2 text-3xl font-black tracking-tighter text-slate-900 mb-2">
              <div class="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <span class="text-2xl">kz</span>
              </div>
              <span>App</span>
            </a>
            <p class="text-slate-500 font-medium">Administrator Access Portal</p>
          </div>

          <div class="card fintech-card overflow-hidden">
            {error && (
              <div class="bg-error/10 border-b border-error/20 p-4 flex items-center gap-3 text-error text-sm font-bold">
                <Icon icon={AlertCircle} size={18} />
                {error}
              </div>
            )}
            
            <div class="card-body p-10">
              <h2 class="text-2xl font-black mb-2">Welcome Back</h2>
              <p class="text-sm text-slate-400 mb-8 font-medium">Please enter your credentials to continue.</p>

              <form action="/auth/login" method="post" class="space-y-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest">Email or Phone</span>
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Icon icon={User} size={18} />
                    </div>
                    <input 
                      type="text" 
                      name="identifier"
                      placeholder="e.g. 0703625588" 
                      class="input input-lg bg-slate-50 border-slate-200 w-full pl-12 focus:bg-white rounded-2xl text-sm" 
                      required 
                      autofocus
                    />
                  </div>
                </div>

                <div class="form-control">
                  <div class="flex justify-between items-center mb-1 px-1">
                    <label class="label-text font-bold text-slate-500 uppercase text-[10px] tracking-widest">Password</label>
                    <a href="/contact" class="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Help?</a>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Icon icon={Lock} size={18} />
                    </div>
                    <input 
                      type="password" 
                      name="password"
                      placeholder="••••••••" 
                      class="input input-lg bg-slate-50 border-slate-200 w-full pl-12 focus:bg-white rounded-2xl text-sm" 
                      required 
                    />
                  </div>
                </div>

                <div class="pt-4">
                  <button class="btn btn-primary btn-lg w-full rounded-2xl h-16 text-lg gap-3 shadow-xl shadow-primary/20">
                    Sign In
                    <Icon icon={ArrowRight} size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="mt-8 text-center">
             <p class="text-xs text-slate-400 font-medium">
               Authorized personnel only. For tech support, contact <br />
               <a href="mailto:kodezebra@gmail.com" class="text-primary hover:underline">kodezebra@gmail.com</a>
             </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
