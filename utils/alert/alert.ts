import { Alert as NativeAlert, Platform } from "react-native";

interface AlertOptions {
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    onCancel?: () => void;
    cancelText?: string;
}

/**
 * 웹과 모바일 환경을 모두 지원하는 통합 Alert 유틸리티
 */
const Alert = {
    /**
     * 확인 버튼만 있는 단순 알림창
     */
    alert: ({ title, message, onConfirm, confirmText = "확인" }: AlertOptions) => {
        if (Platform.OS === "web") {
            // 웹 환경: window.alert 사용
            window.alert(`${title}\n\n${message}`);
            if (onConfirm) onConfirm();
        } else {
            // 앱 환경: React Native Alert 사용
            NativeAlert.alert(title, message, [
                {
                    text: confirmText,
                    onPress: onConfirm,
                },
            ]);
        }
    },

    /**
     * 확인/취소 버튼이 있는 선택 알림창
     */
    confirm: ({
        title,
        message,
        onConfirm,
        confirmText = "확인",
        onCancel,
        cancelText = "취소",
    }: AlertOptions) => {
        if (Platform.OS === "web") {
            // 웹 환경: window.confirm 사용
            const result = window.confirm(`${title}\n\n${message}`);
            if (result && onConfirm) {
                onConfirm();
            } else if (!result && onCancel) {
                onCancel();
            }
        } else {
            // 앱 환경: React Native Alert 사용
            NativeAlert.alert(title, message, [
                {
                    text: cancelText,
                    onPress: onCancel,
                    style: "cancel",
                },
                {
                    text: confirmText,
                    onPress: onConfirm,
                },
            ]);
        }
    },
};

export default Alert;
