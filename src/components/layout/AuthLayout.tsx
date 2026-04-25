import Image from 'next/image';
import Link from 'next/link';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background with Overlay */}
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

      <div className="absolute top-0 left-0 p-8 z-10">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="dograFlix"
            width={167}
            height={45}
            className="w-40 h-auto"
          />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[450px] bg-black md:bg-black/75 rounded-md p-8 md:p-16 min-h-screen md:min-h-0">
        {children}
      </div>
    </div>
  );
}
