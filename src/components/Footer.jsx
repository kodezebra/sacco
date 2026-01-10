export default function Footer() {
  return (
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded mt-auto">
      <nav class="grid grid-flow-col gap-4">
        <a href="/about" class="link link-hover">About us</a>
        <a href="#" class="link link-hover">Contact</a>
        <a href="#" class="link link-hover">Privacy Policy</a>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by kzApp</p>
      </aside>
    </footer>
  );
}
