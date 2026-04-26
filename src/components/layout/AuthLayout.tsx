import Image from 'next/image';
import Link from 'next/link';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col md:items-center md:justify-center bg-black">
      {/* Background with Overlay (Desktop Only) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/assets/images/hero-bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Header/Logo Area */}
      <header className="relative z-10 w-full p-4 md:p-8 md:absolute md:top-0 md:left-0">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="shituFlix"
            width={167}
            height={45}
            className="w-32 md:w-40 h-auto"
          />
        </Link>
      </header>

      {/* Auth Content Box — matches Frame 61: 450w x 708h card */}
      <div className="relative z-10 w-full max-w-[450px] md:min-h-[660px] md:bg-black/60 rounded-[4px] px-6 py-8 md:px-[68px] md:py-[60px] md:shadow-xl">
        {children}
      </div>
    </div>
  );
}
