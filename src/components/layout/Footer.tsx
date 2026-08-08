import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl font-semibold text-white">{APP_NAME}</p>
            <p className="text-sm mt-1">Your Personal Style Guide</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">
              Contact
            </a>
            <span className="text-neutral-600">·</span>
            <span>© {new Date().getFullYear()} {APP_NAME}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}