'use client';

const footerLinks = [
  'FAQ', 'Help Center', 'Account', 'Media Center',
  'Investor Relations', 'Jobs', 'Ways to Watch', 'Terms of Use',
  'Privacy', 'Cookie Preferences', 'Corporate Information', 'Contact Us',
  'Speed Test', 'Legal Notices', 'Only on dograFlix'
];

export function Footer() {
  return (
    <footer className="bg-[#141414] text-gray-500 py-16 px-4 md:px-12 lg:px-24">
      <div className="max-w-[1000px] mx-auto">


        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {footerLinks.map((link) => (
            <li key={link}>
              <a href="#" className="text-sm hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="border border-gray-500 px-2 py-1 inline-block text-xs mb-6 cursor-pointer hover:text-white transition-colors">
          Service Code
        </div>

        <div className="text-[11px]">
          © 1997-2026 dograFlix, Inc.
        </div>
      </div>
    </footer>
  );
}

