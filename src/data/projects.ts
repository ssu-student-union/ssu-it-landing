import type { StaticImageData } from "next/image";
import campusClubImage from "../assets/images/campus-club.png";
import campusMapImage from "../assets/images/campus-map.png";
import itLandingImage from "../assets/images/it-landing.png";
import passuImage from "../assets/images/passu.png";
import reclinerImage from "../assets/images/recliner.png";
import ssuportImage from "../assets/images/ssuport.png";
import studentCouncilImage from "../assets/images/student-council.png";

export type Project = {
  title: string;
  description: string;
  image: StaticImageData;
};

export const PROJECTS: Project[] = [
  {
    title: "SSUPORT",
    description: "총학생회 특별장학금 신청/관리 시스템 서비스",
    image: ssuportImage,
  },
  {
    title: "동아리연합회 홈페이지",
    description: "중앙동아리들의 정보 전달 및 행정처리를 위한 서비스",
    image: campusClubImage,
  },
  {
    title: "총학생회 홈페이지",
    description: "학생과 자치기구를 잇는 소통의 장",
    image: studentCouncilImage,
  },
  {
    title: "PASSU",
    description:
      "수기 수령증 작성과 재학생 인증을 간소화한 디지털 수령증 서비스",
    image: passuImage,
  },
  {
    title: "캠퍼스맵",
    description:
      "최신 정보를 제공하는 캠퍼스맵 챗봇과 웹사이트를 구현한 서비스",
    image: campusMapImage,
  },
  {
    title: "IT지위원회 랜딩페이지",
    description:
      "IT지원위원회를 한 눈에 이해할 수 있는 디지털 서비스/플랫폼을 기획·개발·운영",
    image: itLandingImage,
  },
  {
    title: "리클라이너 예약시스템",
    description:
      "중앙도서관 리클라이너 좌석의 무분별한 사용 및 독점을 방지하기 위해 개발한 시스템",
    image: reclinerImage,
  },
  {
    title: "총학생회 카카오톡 챗봇",
    description:
      "정보 접근성을 향상하고자 학교생활도우미 US:SUM 챗봇 서비스를 개발 및 운영",
    image: itLandingImage,
  },
];
