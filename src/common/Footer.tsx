import Image from "next/image";
import Link from "next/link";
import copyright from "../assets/icons/copyright.svg";
import instagram from "../assets/icons/instagram.svg";
import kakao from "../assets/icons/kakao.svg";
import linkedIn from "../assets/icons/linkedIn.svg";
import mail from "../assets/icons/mail.svg";
import logo from "../assets/logo.svg";

export const Footer = () => {
  return (
    <footer className="flex w-full flex-col justify-between gap-8 bg-[#f2f3f4] px-4 py-10 sm:px-8 sm:py-12 lg:h-87 lg:gap-0 lg:px-36 lg:py-16">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <Image src={logo} alt="" className="h-8 w-auto" />
            <span className="font-semibold text-[#1b1c1c] text-xl">
              IT지원위원회
            </span>
          </div>
          <p className="text-[#1b1c1c] text-[0.9375rem]">
            숭실대학교 구성원들의 소리 없는 한숨을 찾아 해결합니다
          </p>
        </div>

        <div className="flex items-center gap-3.75">
          <Link
            href="#"
            aria-label="Instagram"
            className="flex size-9 items-center justify-center rounded-full bg-[#e5e7e8]"
          >
            <Image src={instagram} alt="" className="size-5" />
          </Link>
          <Link
            href="#"
            aria-label="이메일"
            className="flex size-9 items-center justify-center rounded-full bg-[#e5e7e8]"
          >
            <Image src={mail} alt="" className="size-5" />
          </Link>
          <Link
            href="#"
            aria-label="카카오톡"
            className="flex size-9 items-center justify-center rounded-full bg-[#e5e7e8]"
          >
            <Image src={kakao} alt="" className="size-5" />
          </Link>
          <Link
            href="#"
            aria-label="LinkedIn"
            className="flex size-9 items-center justify-center rounded-full bg-[#e5e7e8]"
          >
            <Image src={linkedIn} alt="" className="size-5" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-[#1b1c1c] text-[0.8125rem]">
          위치 : 학생회관 211호
        </p>
        <div className="flex items-center gap-1">
          <Image src={copyright} alt="" className="size-3" />
          <p className="font-medium text-[#1b1c1c] text-[0.8125rem]">
            IT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
