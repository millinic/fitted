import { APP_NAME, APP_TAGLINE } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-serif text-xl font-semibold text-neutral-900">{APP_NAME}</p>
            <p className="text-sm text-neutral-500 mt-1">{APP_TAGLINE}</p>
          </div>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}