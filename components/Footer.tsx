export default function Footer() {
    return (
      <footer className="bg-transparent text-ink-500 text-sm py-6 text-center border-t border-surface-700">
        <p>
          © {new Date().getFullYear()} Computer Help · KvK 12345678 · BTW NL001234567B01 ·{' '}
          <a href="/privacy" className="text-ink-300 hover:text-primary-500">
            Privacy & Cookies
          </a>{' '}
          ·{' '}
          <a href="/terms" className="text-ink-300 hover:text-primary-500">
            Algemene voorwaarden
          </a>
        </p>
      </footer>
    );
  }
  