import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.svg";

export const Header = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between px-4 bg-white sm:h-20 sm:px-8 lg:h-25 lg:px-20">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={logo}
          alt="IT지원위원회"
          className="h-auto w-8 sm:w-9 lg:w-10"
          priority
        />
        <span className="font-bold text-ink text-lg tracking-[-0.02em] sm:text-xl lg:text-[1.75rem]">
          IT지원위원회
        </span>
      </Link>

      <nav className="flex items-center gap-3 sm:gap-8 lg:gap-16">
        <Link
          href="/"
          className="relative hidden font-semibold text-[#1b1c1c] text-lg whitespace-nowrap sm:block lg:text-2xl"
        >
          위원회 소개
        </Link>
        <Link
          href="/projects"
          className="relative hidden font-semibold text-[#1b1c1c] text-lg whitespace-nowrap sm:block lg:text-2xl"
        >
          프로젝트
        </Link>
        <Link
          href="/recruiting"
          className="flex items-center justify-center whitespace-nowrap rounded-4xl bg-gradient-to-b from-[#4a4a4a] to-black px-4 py-2 font-semibold text-[#e5e5e5] text-sm transition-transform duration-300 ease-in-out hover:scale-105 sm:px-6 sm:text-lg lg:px-8 lg:py-3 lg:text-2xl"
        >
          리크루팅
        </Link>
      </nav>
    </header>
  );
};
