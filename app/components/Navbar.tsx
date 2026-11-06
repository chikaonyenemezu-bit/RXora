
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/formulary', label: 'Formulary' },
  { href: '/reconciliation', label: 'Reconciliation' },
  { href: '/fhir', label: 'FHIR API' },
  { href: '/eds', label: 'EDS' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Safety disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-8 py-2 text-xs text-amber-800">
        <div className="max-w-6xl mx-auto">
          Demonstration platform using real Manitoba formulary data and synthetic patient cases only. Not for clinical decision-making.
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 md:px-8 h-16 flex items-center justify-between sticky top-0 z-50">

        {/* Rxora logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Rxora Home"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/rxora-logo.png"
            alt="Rxora"
            width={180}
            height={60}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            )
          })}

          <a
            href="https://github.com/chikaonyenemezu-bit/manitoba-med-safety"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white bg-gray-900 px-4 py-1.5 rounded-md ml-2 hover:bg-gray-700 transition-colors"
          >
            GitHub
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="rxora-mobile-menu"
        >
          <span
            className={`block w-5 h-0.5 bg-gray-900 transition-transform duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 transition-opacity duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-gray-900 transition-transform duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="rxora-mobile-menu"
          className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex flex-col gap-1 sticky top-16 z-40 shadow-sm"
        >
          {navLinks.map(({ href, label }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          })}

          <a
            href="https://github.com/chikaonyenemezu-bit/manitoba-med-safety"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white bg-gray-900 px-4 py-2 rounded-md mt-1 text-center hover:bg-gray-700 transition-colors"
          >
            GitHub
          </a>
        </div>
      )}
    </>
  )
}
