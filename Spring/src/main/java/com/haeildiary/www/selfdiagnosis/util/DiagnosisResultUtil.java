package com.haeildiary.www.selfdiagnosis.util;

public class DiagnosisResultUtil {

    // 불안 결과
    public static String anxietyResult(Integer totalScore){
        if (totalScore == null) {
            return "자가진단 : 불안 체크리스트의 점수가 없어요";
        }

        //0–4: 불안하지 않음 5–9: 가끔 불안함 10–14: 자주 불안함 15–21: 매우 불안함
        if (totalScore <= 4) {
            return "평온해요";
        }else if (totalScore <= 9){
            return "가끔 불안해요";
        }else if (totalScore <= 14){
            return "자주 불안해요";
        }else if (totalScore <= 21){
            return "매우 불안해요";
        }else {
            return "진단 결과를 확인할 수 없어요. 다시 시도해주세요";
        }
    }

    // 우울 결과
    public static String depressionResult(Integer totalScore){
        if (totalScore == null) {
            return "자가진단 : 우울 체크리스트의 점수가 없어요";
        }

        //0-4: 우울하지 않음, 5-9: 가끔 우울함, 10-14: 우울함, 15-19: 자주 우울함 20-27 : 매우 우울함
        if (totalScore <= 4) {
            return "평온해요";
        }else if (totalScore <= 9){
            return "가끔 우울해요";
        }else if (totalScore <= 14){
            return "종종 우울해요";
        }else if (totalScore <= 19){
            return "자주 우울해요";
        }else if (totalScore <= 27){
            return "매우 우울해요";
        }else {
            return "진단 결과를 확인할 수 없어요. 다시 시도해주세요";
        }
    }

    // 스트레스 결과
    public static String stressResult(Integer totalScore){
        if (totalScore == null) {
            return "자가진단 : 스트레스 체크리스트의 점수가 없어요";
        }

        //0-13 : 낮은 스트레스, 14-26: 중간 정도의 스트레스, 27-40: 높은 스트레스
        if (totalScore <= 13) {
            return "평온해요";
        }else if (totalScore <= 26){
            return "가끔 스트레스를 받아요";
        }else if (totalScore <= 40){
            return "스트레스를 많이 받아요";
        }else {
            return "진단 결과를 확인할 수 없어요. 다시 시도해주세요";
        }

    }
}
