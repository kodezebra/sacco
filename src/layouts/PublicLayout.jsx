import MainLayout from './MainLayout.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import { Menu, Search, Bell } from 'lucide';

export default function PublicLayout({ title, children }) {
  return (
    <MainLayout title={title}>
      <div class="flex flex-col min-h-screen">
        {/* Public Navbar */}
        <div class="navbar bg-base-100 shadow-sm border-b border-base-200 sticky top-0 z-50 px-4">
          <div class="navbar-start gap-2">
            {/* Mobile Burger */}
            <div class="dropdown lg:hidden">
              <div tabIndex={0} role="button" class="btn btn-ghost btn-circle">
                <Icon icon={Menu} size={20} />
              </div>
              <ul
                tabIndex="-1"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-base-200">
                <li><a href="/">Homepage</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/auth/login">Login</a></li>
              </ul>
            </div>
            
            {/* Logo */}
            <a href="/" class="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span class="text-primary">kz</span>App
            </a>

            {/* Desktop Menu */}
            <div class="hidden lg:flex ml-4">
              <ul class="menu menu-horizontal px-1 gap-1">
                <li><a href="/">Homepage</a></li>
                <li><a href="/about">About</a></li>
              </ul>
            </div>
          </div>

          <div class="navbar-end gap-1">
            <button class="btn btn-ghost btn-circle hidden sm:flex">
              <Icon icon={Search} size={20} />
            </button>
            <button class="btn btn-ghost btn-circle hidden sm:flex">
              <div class="indicator">
                <Icon icon={Bell} size={20} />
                <span class="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
            <a href="/auth/login" class="btn btn-primary btn-sm ml-2 px-6">Login</a>
          </div>
        </div>

        {/* Page Content */}
        <main class="flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </MainLayout>
  );
}
