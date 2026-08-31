const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 패키지 내보내기 호환성 관련 에러 방지 설정
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./styles/global.css" });
