import MainLayout from './MainLayout.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import { Menu, Search, Bell } from 'lucide';

export default function PublicLayout({ title, children }) {
  return (
    <MainLayout title={title}>
      <div class="flex flex-col min-h-screen selection:bg-primary/10 selection:text-primary">
        {/* Public Navbar */}
        <nav class="glass-nav px-4 py-2">
          <div class="max-w-7xl mx-auto navbar px-0">
            <div class="navbar-start gap-2">
              {/* Mobile Burger */}
              <div class="dropdown lg:hidden">
                <div tabIndex={0} role="button" class="btn btn-ghost btn-circle">
                  <Icon icon={Menu} size={22} />
                </div>
                <ul
                  tabIndex="-1"
                  class="menu menu-sm dropdown-content bg-base-100 rounded-3xl z-1 mt-3 w-64 p-4 shadow-2xl border border-base-200">
                  <li class="menu-title opacity-40 uppercase text-[10px] font-bold tracking-widest px-4 mb-2">Navigation</li>
                  <li><a href="/" class="py-3 px-4 rounded-xl">Homepage</a></li>
                  <li><a href="/about" class="py-3 px-4 rounded-xl">About Us</a></li>
                  <li><a href="/services" class="py-3 px-4 rounded-xl">Our Services</a></li>
                  <li><a href="/contact" class="py-3 px-4 rounded-xl">Contact</a></li>
                  <div class="divider my-2"></div>
                  <li><a href="/auth/login" class="btn btn-primary btn-sm rounded-xl">Client Login</a></li>
                </ul>
              </div>
              
              {/* Logo */}
              <a href="/" class="flex items-center gap-2 text-2xl font-black tracking-tighter text-slate-900 group">
                <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <span class="text-xl">kz</span>
                </div>
                <span>App</span>
              </a>

              {/* Desktop Menu */}
              <div class="hidden lg:flex ml-10">
                <ul class="menu menu-horizontal px-1 gap-1 text-sm font-medium text-slate-500">
                  <li><a href="/" class="rounded-lg hover:text-primary transition-colors">Home</a></li>
                  <li><a href="/about" class="rounded-lg hover:text-primary transition-colors">About</a></li>
                  <li><a href="/services" class="rounded-lg hover:text-primary transition-colors">Services</a></li>
                  <li><a href="/contact" class="rounded-lg hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            <div class="navbar-end gap-3">
              <a href="/auth/login" class="btn btn-primary btn-md rounded-2xl px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                Sign In
              </a>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main class="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </MainLayout>
  );
}
