import type { StaticImageData } from "next/image";
import campusClubImage from "../assets/images/campus-club.webp";
import campusMapImage from "../assets/images/campus-map.webp";
import chatbotImage from "../assets/images/chat-bot.webp";
import itLandingImage from "../assets/images/it-landing.webp";
import passuImage from "../assets/images/passu.webp";
import reclinerImage from "../assets/images/recliner.webp";
import ssuportImage from "../assets/images/ssuport.webp";
import studentCouncilImage from "../assets/images/student-council.webp";

export type TeamRole = {
  role: string;
  name: string;
  description: string;
};

export type FuturePlanItem = {
  label: string;
  subItems?: string[];
};

export type ProjectDetail = {
  subtitle: string;
  description: string[];
  team: TeamRole[];
  progressStatus: string[];
  futurePlans: FuturePlanItem[];
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  image: StaticImageData;
  detail?: ProjectDetail;
};

export const PROJECTS: Project[] = [
  {
    slug: "ssuport",
    title: "SSUport",
    description: "총학생회 특별장학금 신청/관리 시스템 서비스",
    image: ssuportImage,
    detail: {
      subtitle: "특별장학금 신청 / 관리 시스템",
      description: [
        "안심하고 신청하는 숭실대학교 특별장학금 통합 시스템 SSUport입니다.",
        "SSUport는 특별장학금 신청 과정을 디지털로 전환하여, 서류 제출부터 평가까지 편리하게 관리하는 웹 서비스입니다.",
        "SSUport는 학생들에게 직관적이고 편리한 신청 경험을, 관리자에게는 공정한 심사에 집중할 수 있는 효율적인 도구를 제공합니다.",
        "구성원 모두가 특별장학금 본연의 취지에 집중할 수 있도록 돕는 숭실대학교 특별장학금 전용 서비스입니다.",
      ],
      team: [
        {
          role: "PM",
          name: "류다인",
          description: "프로젝트 관리, 자치기구 협의",
        },
        {
          role: "Design",
          name: "황애라",
          description: "UI/UX 디자인 및 사용자 경험 개선",
        },
        {
          role: "Frontend",
          name: "박수민, 백승현, 이태석",
          description: "웹 프론트엔드 개발",
        },
        {
          role: "Backend",
          name: "장효원, 이성윤, 박찬규",
          description: "서버 및 데이터베이스 개발",
        },
      ],
      progressStatus: [
        "총학생회 대상 테스트 및 피드백 수렴 완료",
        "서비스 안정화",
        "2026학년도 1학기 시범도입 완료",
        "데이터 확보 및 인사이트 추출",
        "2026학년도 2학기 확대 도입을 위한 유관부서 논의 진행 중",
      ],
      futurePlans: [
        {
          label: "SSUport v2.0 개발",
          subItems: [
            "리디자인, 리팩토링",
            "교통비・근면숭실・주거비 장학금 프로토타입 제작 및 검증",
          ],
        },
        { label: "총학생회 등 유관부서 논의 진행" },
        {
          label: "총학생회 및 일반 학우 피드백 수렴",
          subItems: ["신청자, 관리자 학우 대상 사용성 테스트 진행"],
        },
        { label: "2026학년도 2학기 도입 예정" },
        { label: "QA 및 유지보수" },
      ],
    },
  },
  {
    slug: "campus-club",
    title: "동아리연합회 홈페이지",
    description: "중앙동아리들의 정보\n전달 및 행정처리를 위한 서비스",
    image: campusClubImage,
    detail: {
      subtitle: "동아리 운영 관리 시스템",
      description: [
        "활동보고서 제출, 공동연습실 예약 등 동아리 운영에 핵심적인 기능을 제공하는 동아리연합회 홈페이지의 안정적인 유지보수 및 UI/UX 개선을 위해 동아리연합회 & IT지원위원회가 협업하여 진행하는 TF입니다.",
      ],
      team: [
        {
          role: "PM",
          name: "허강현",
          description: "프로젝트 관리, 자치기구 협의",
        },
        {
          role: "Design",
          name: "양예원",
          description: "UI/UX 디자인 및 사용자 경험 개선",
        },
        {
          role: "Frontend",
          name: "김경주, 이태건, 홍준우",
          description: "웹 프론트엔드 개발",
        },
        {
          role: "Backend",
          name: "양의종, 조수한, 박찬규",
          description: "서버 및 데이터베이스 개발",
        },
      ],
      progressStatus: [
        "와이어프레임 제작 및 UI 디자인",
        "프론트엔드 & 백엔드 리팩토링 진행중",
        "이벤트 설계",
      ],
      futurePlans: [
        { label: "이벤트 텍소노미 제작" },
        {
          label: "프론트엔드 & 백엔드 리팩토링",
        },
        { label: "DB/API 마이그레이션" },
        { label: "QA 및 서비스 오픈" },
      ],
    },
  },
  {
    slug: "student-council",
    title: "총학생회 홈페이지",
    description: "학생과 자치기구를 잇는 소통의 장",
    image: studentCouncilImage,
    detail: {
      subtitle: "원활한 소통을 위한 학생자치기구 서비스",
      description: [
        "총학생회 홈페이지는 학생과 학생자치기구의 소통을 이어주는 홈페이지입니다.",
        "학생자치기구는 공지사항등을 통해 이야기를 전달하고, 학생은 소통 게시판을 통해 목소리를 낼 수 있습니다.",
        "총학생회 홈페이지 TF는 기존에 제공하던 서비스에 더해, 오류를 철저히 개선하여 안정적으로 운영하며, 학생들에게 도움이 되는 서비스를 제공하기 위해 끊임없이 발전하고 있습니다.",
      ],
      team: [
        {
          role: "PM",
          name: "박현지",
          description: "프로젝트 관리, 자치기구 협의, 신규 기능 개발",
        },
        {
          role: "Design",
          name: "양예원",
          description: "UI/UX 디자인 및 사용자 경험 개선",
        },
        {
          role: "Frontend",
          name: "박수민, 황동준, 문세종, 이태건, 이태석, 김경주",
          description: "웹 프론트엔드 개발",
        },
        {
          role: "Backend",
          name: "양의종, 조성현",
          description: "서버 및 데이터베이스 개발",
        },
      ],
      progressStatus: [
        "홈페이지 1차/2차 배포 완료 &\n3차 개발 및 대규모 리팩토링",
        "SSO 구축 및 PASSU 연동",
        "홈페이지 3차 개발 배포 예정 및 4차 개발",
      ],
      futurePlans: [
        {
          label:
            "총학생회 홈페이지 안정화(사용성 개선, 성능 최적화, 버그 최소화)",
        },
        {
          label: "총학생회 공약이행률 등 신규 기능 추가 제공",
        },
        {
          label:
            "GA, 클라리티, A/B Test 환경 구축을 통한 사용자 데이터 분석 기반 마련",
        },
        { label: "관리자 페이지 제작" },
      ],
    },
  },
  {
    slug: "passu",
    title: "PASSU",
    description:
      "수기 수령증 작성과 재학생 인증을 간소화한\n디지털 수령증 서비스",
    image: passuImage,
    detail: {
      subtitle: "디지털수령증 플랫폼",
      description: [
        "기존 교내 대규모 상품 배부 행사에서의 수기 수령증 작성과 재학생 인증을 간소화하여, 행사 진행자와 참가자 모두가 빠르고 편리하게 상품을 배부·수령할 수 있도록 돕는 디지털 수령증 서비스입니다.",
      ],
      team: [
        {
          role: "PM",
          name: "장우영",
          description: "프로젝트 관리, 자치기구 협의, 자금 확보",
        },
        {
          role: "Design",
          name: "배희진",
          description: "UI/UX 디자인 및 사용자 경험 개선",
        },
        {
          role: "Frontend",
          name: "구효민, 배지영",
          description: "웹 프론트엔드 개발",
        },
        {
          role: "Backend",
          name: "권세인, 장인호",
          description: "서버 및 데이터베이스 개발",
        },
      ],
      progressStatus: [
        "MVP 개발 및 POC 진행",
        "자치기구 대상 PASSU 의견 수렴",
        "총학생회 및 자치기구 홍보 진행\n(전체간부수련회)",
        "2025년 3월 총학생회 개강행사 도입\n(이틀 간 1,000명 배부)",
      ],
      futurePlans: [
        { label: "중앙감사위원회 대상 정식 도입 추진" },
        {
          label: "감사 대응 기능 보완",
        },
        { label: "자치기구 대상 도입 확대" },
        { label: "운영 데이터 분석 기반 마련" },
      ],
    },
  },
  {
    slug: "campus-map",
    title: "캠퍼스맵",
    description:
      "최신 정보를 제공하는 캠퍼스맵 챗봇과\n웹사이트를 구현한 서비스",
    image: campusMapImage,
    detail: {
      subtitle: "교내 시설 정보 제공 서비스",
      description: [
        "기존 교내 시설 정보 탐색 과정의 비효율을 개선하고자, 최신 정보를 제공하는 캠퍼스맵 챗봇과 웹사이트를 구현했습니다. 지난 12월 7일 서비스 런칭 후, 사용자들에게 빠르고 정확한 정보를 제공하고 있습니다.",
      ],
      team: [
        {
          role: "서비스 개발",
          name: "편유나",
          description: "챗봇 및 웹사이트 개발",
        },
        {
          role: "TF 기획 및 데이터 수집",
          name: "류지운, 구정모, 박지민, 백현서, 엄수현, 지서우",
          description: "시설 데이터 수집 및 가공",
        },
      ],
      progressStatus: [
        "카카오톡 챗봇 배포 및 운영",
        "캠퍼스맵 웹사이트 배포 및 운영",
      ],
      futurePlans: [
        { label: "시설물 정보 변동 시 내용 업데이트" },
        {
          label: "피드백 및 민원 사항 기반 유지보수",
        },
      ],
    },
  },
  {
    slug: "it-landing",
    title: "IT지원위원회 랜딩페이지",
    description:
      "IT지원위원회를 한 눈에 이해할 수 있는\n디지털 서비스/플랫폼을 기획·개발·운영",
    image: itLandingImage,
    detail: {
      subtitle: "IT지원위원회 공식 홈페이지",
      description: [
        "IT지원위원회는 학내 서비스의 안정적인 운영과 학생 자치 문화 활성화를 위해 학생 대상 디지털 서비스/플랫폼을 기획·개발·운영합니다. IT지원위원회를 한눈에 이해할 수 있는 공식 랜딩페이지(소개 페이지) 를 제작, 운영하는 TF입니다.",
      ],
      team: [
        {
          role: "PM",
          name: "최준근",
          description: "프로젝트 관리",
        },
        {
          role: "Design",
          name: "배희진",
          description: "UI/UX 디자인 및 사용자 경험 개선",
        },
        {
          role: "Frontend",
          name: "배지영, 홍준우",
          description: "웹 프론트엔드 개발",
        },
      ],
      progressStatus: [
        "소개(랜딩) · 진행 프로젝트(TF) · 리크루팅 3개 메인 페이지 구조 확정",
        "핵심 콘텐츠 구조 확정",
        "와이어프레임 초안 완성",
        "디자인 시안 작업 및 프론트엔드 개발 준비 (스택・레포 세팅)",
        "사이트 내 지원 동선 설계: 리크루팅 페이지",
      ],
      futurePlans: [
        {
          label:
            "위원회 소개/조직도/프로젝트·행사 콘텐츠를 비개발자도 쉽게 수정할 수 있도록 운영 편의성 강화",
        },
        {
          label:
            "신규 기능이 필요해질 경우, 운영 데이터/사용자 요구를 기반으로 필요 시점에 추가 개발하는 방식으로 확장",
        },
        {
          label:
            "운영 과정에서 발견되는 UI/콘텐츠 개선사항 반영, 유지보수 체계 정리",
        },
      ],
    },
  },
  {
    slug: "recliner",
    title: "리클라이너 예약시스템",
    description:
      "중앙도서관 리클라이너 좌석의 무분별한 사용\n및 독점을 방지하기 위해 개발한 시스템",
    image: reclinerImage,
    detail: {
      subtitle: "중앙도서관 리클라이너 좌석 예약 서비스",
      description: [
        "중앙도서관 리클라이너 좌석의 무분별한 사용 및 독점을 방지하기 위해 개발한 예약 시스템 입니다. 2024년 8월 중앙도서관 만족도 조사에서 75.3%의 도입 수요가 확인되어 IT지원위원회에서 개발 및 운영을 진행 중입니다.",
      ],
      team: [
        {
          role: "Design & Frontend",
          name: "편유나",
          description:
            "UI/UX 디자인 및 사용자 경험 개선, 키오스크 개발, 긴급대응",
        },
      ],
      progressStatus: [
        "디자인 및 개발 완료",
        "중앙도서관 설치 및 시범 운영\n(9/11 ~ 9/30)",
        "중앙도서관 정식 운영(10/1)",
      ],
      futurePlans: [
        {
          label:
            "좌석 수를 고려했을 때, 리소스 투자 대비 효용 낮음 -> 현상 유지 판단",
        },
        {
          label: "문제 발생 시 긴급 대응 진행",
        },
      ],
    },
  },
  {
    slug: "chatbot",
    title: "총학생회 카카오톡 챗봇",
    description:
      "정보 접근성을 향상하고자 학교생활도우미\nUS:SUM 챗봇 서비스를 개발 및 운영",
    image: chatbotImage,
    detail: {
      subtitle: "학교 생활 도우미 챗봇 서비스",
      description: [
        "다양한 학교 사이트에 분리되어 있는 정보들을 통합해 학생들의 정보 탐색 피로도를 줄이고, 정보 접근성을 향상하고자 학교생활도우미 US:SUM 챗봇 서비스를 개발 및 운영합니다.",
        "비교과 소식 간편 조회, 교내 관련 정보 탐색 (학사, 운영시간, 위치 등), 총학생회 국별 사업소식 등을 조회할 수 있습니다. 카카오톡 채널 ‘숭실대학교총학생회’를 추가하여 원하는 정보를 질문할 수 있습니다.",
      ],
      team: [
        {
          role: "데이터 학습",
          name: "안지원",
          description: "숭실대 공식 사이트 정보 정리 및 학습",
        },
        {
          role: "비교과 크롤링",
          name: "편유나",
          description:
            "펀시스템, 슈케치 정보 기반 비교과 소식 크롤링 및 발송 개발",
        },
      ],
      progressStatus: [
        "슈케치, 숭실대 공식 사이트 정보 학습",
        "숭실대 내 비교과 소식 카테고리별 크롤링 및 발송",
      ],
      futurePlans: [
        {
          label:
            "사용자 질문 로그를 분석해 탐색 실패율이 높은 정보부터 답변 데이터 보강",
        },
        {
          label: "학사·운영 정보 변경 시 챗봇 응답에 신속 반영해 최신성 유지",
        },
        {
          label:
            "운영 안정화에 집중, 추가 기능은 실제 사용 패턴 확인 후 단계적 검토",
        },
      ],
    },
  },
];
