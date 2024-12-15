import toast from "react-hot-toast";
import { usePrompt } from "@/app/_components/PromptContext";

export type LowIncomeQuestionnaireResult = {
  monthly_income: string;
};

export function useLowIncomeQuestionnairePrompt(): () => Promise<boolean> {
  const prompt = usePrompt();

  return async () => {
    const result: LowIncomeQuestionnaireResult | undefined = (await prompt(
      "Please answer a few questions to determine your eligibility for low income membership.",
      [
        // TODO: add more questions here
        {
          key: "monthly_income",
          label: "What is your monthly income in SEK?",
          validate: (value) => !isNaN(parseInt(value)),
        },
      ]
    )) as LowIncomeQuestionnaireResult | undefined;

    if (!result) {
      return false;
    }

    // TODO: add actual logic here
    const isLowIncome = parseInt(result.monthly_income) < 20000;

    if (isLowIncome) {
      toast.success(
        "Congratulations! You are eligible for low income membership."
      );
    } else {
      toast.error(
        "Unfortunately you are not eligible for low income membership."
      );
    }

    return isLowIncome;
  };
}
