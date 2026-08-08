import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-brand-200 bg-brand-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg font-bold text-brand-950">{APP_NAME}</p>
          <p className="text-sm text-brand-500">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}