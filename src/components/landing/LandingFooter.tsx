import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="bg-black border-t-8 border-grey-800 py-16 px-8 lg:px-24 text-grey-350">
      <div className="max-w-5xl mx-auto">
        <p className="mb-8">Questions? Contact us.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm underline mb-12">
          <Link href="#">FAQ</Link>
          <Link href="#">Help Center</Link>
          <Link href="#">Account</Link>
          <Link href="#">Media Center</Link>
          <Link href="#">Investor Relations</Link>
          <Link href="#">Jobs</Link>
          <Link href="#">Ways to Watch</Link>
          <Link href="#">Terms of Use</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Cookie Preferences</Link>
          <Link href="#">Corporate Information</Link>
          <Link href="#">Contact Us</Link>
        </div>

        <div className="mb-8">
          <button className="border border-grey-350/50 px-4 py-2 rounded text-sm flex items-center gap-2">
            English
          </button>
        </div>

        <p className="text-xs">dograFlix India</p>
      </div>
    </footer>
  );
}
