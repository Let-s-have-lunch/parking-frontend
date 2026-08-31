import type { Config } from "tailwindcss";

export default {
    // 다크 모드를 시스템 설정이 아닌 클래스(기준)로 제어
    darkMode: "class",
    // 테일윈드 스타일을 적용할 파일들의 경로 파일 확장자 지정
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    plugins: [],
} satisfies Config;
