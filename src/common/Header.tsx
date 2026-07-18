import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.svg";

export const Header = () => {
  return (
    <header className="flex h-25 w-full items-center justify-between px-20 bg-white">
      <Link href="/" className="flex items-center gap-2">
        <Image src={logo} alt="IT지원위원회" className="h-auto w-10" priority />
        <span className="font-bold text-[#1b1c1c] text-[1.75rem] tracking-[-0.02em]">
          IT지원위원회
        </span>
      </Link>

      <nav className="flex items-center gap-16">
        <Link
          href="#"
          className="font-semibold text-[#1b1c1c] text-2xl whitespace-nowrap"
        >
          위원회 소개
        </Link>
        <Link
          href="#"
          className="font-semibold text-[#1b1c1c] text-2xl whitespace-nowrap"
        >
          진행 프로젝트
        </Link>
        <Link
          href="/recruiting/personal-info"
          className="flex items-center justify-center whitespace-nowrap rounded-4xl bg-linear-to-b from-[#4a4a4a] to-black px-8 py-3 font-semibold text-[#e5e5e5] text-2xl"
        >
          리크루팅
        </Link>
      </nav>
    </header>
  );
};
