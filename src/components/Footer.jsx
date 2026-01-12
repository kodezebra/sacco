import Icon from './Icon.jsx';
import { Mail, Phone, ExternalLink, Cpu } from 'lucide';

export default function Footer() {
  return (
    <footer class="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div class="space-y-6">
            <a href="/" class="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
              <span class="text-primary">kz</span>App SACCO
            </a>
            <p class="text-sm leading-relaxed opacity-70">
              A modern financial cooperative platform designed for transparency, security, and community growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 class="text-white font-bold uppercase tracking-widest text-xs mb-6">Explore</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="/about" class="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/services" class="hover:text-primary transition-colors">Our Services</a></li>
              <li><a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" class="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 class="text-white font-bold uppercase tracking-widest text-xs mb-6">Support</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="/contact" class="hover:text-primary transition-colors">Contact Center</a></li>
              <li><a href="/security" class="hover:text-primary transition-colors">Security Statement</a></li>
              <li><a href="/help" class="hover:text-primary transition-colors">Help Documentation</a></li>
            </ul>
          </div>

          {/* Developer CTA */}
          <div class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            <div class="flex items-center gap-3 mb-4">
               <div class="p-2 bg-primary/20 rounded-lg text-primary">
                  <Icon icon={Cpu} size={20} />
               </div>
               <h4 class="text-white font-bold text-sm">Tech Partnership</h4>
            </div>
            <p class="text-xs mb-6 leading-relaxed opacity-70">
              Need a custom fintech or management solution? Power your business with <span class="text-white font-bold">KodeZebra</span>.
            </p>
            <div class="space-y-3">
              <a href="mailto:kodezebra@gmail.com" class="flex items-center gap-2 text-xs hover:text-white transition-colors">
                <Icon icon={Mail} size={14} class="text-primary" />
                kodezebra@gmail.com
              </a>
              <a href="tel:+256703625588" class="flex items-center gap-2 text-xs hover:text-white transition-colors">
                <Icon icon={Phone} size={14} class="text-primary" />
                +256 703 625 588
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs opacity-50">
            Copyright © {new Date().getFullYear()} kzApp SACCO. All rights reserved.
          </p>
          <div class="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest opacity-40">
             <span>Engineered by</span>
             <a href="#" class="text-white hover:text-primary transition-colors flex items-center gap-1">
               KodeZebra
               <Icon icon={ExternalLink} size={10} />
             </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
