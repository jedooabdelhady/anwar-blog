import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={40} variant="pepper" />
          </div>

          <ul className="flex items-center gap-6 text-sm text-pepper/80">
            <li>
              <Link
                href="/terms"
                className="hover:text-sienna transition-colors"
              >
                الشروط والأحكام
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-sienna transition-colors"
              >
                سياسة الخصوصية
              </Link>
            </li>
          </ul>

          <p className="text-sm text-pepper/70">
            © جميع الحقوق محفوظة {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
