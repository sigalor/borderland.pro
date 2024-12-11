import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export enum LLMResponseFormat {
  String = "string",
  StringArray = "string_array",
}

export class SyntheticLoom {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async ask(
    prompt: string,
    responseFormat: LLMResponseFormat = LLMResponseFormat.String
  ): Promise<{ response: string; cost: number }> {
    let responseFormatFinal;
    if (responseFormat === LLMResponseFormat.StringArray) {
      responseFormatFinal = zodResponseFormat(
        z.object({ items: z.array(z.string()) }),
        "string_array"
      );
    }

    const completionResponse = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: responseFormatFinal,
    });

    // both costs are in dollars here, see https://openai.com/api/pricing/
    const costPromptTokens =
      (0.15 / 1000000) * completionResponse.usage!.prompt_tokens;
    const costCompletionTokens =
      (0.6 / 1000000) * completionResponse.usage!.completion_tokens;

    // $1 = 1,000,000 Synthetic Loom API credits
    const marginFactor = 3;
    const usedApiCredits = Math.ceil(
      (costPromptTokens + costCompletionTokens) * marginFactor * 1000000
    );

    return {
      response: completionResponse.choices[0].message.content!,
      cost: Math.ceil(usedApiCredits),
    };
  }

  async askStringArray(
    prompt: string
  ): Promise<{ response: string[]; cost: number }> {
    const res = await this.ask(prompt, LLMResponseFormat.StringArray);
    return {
      response: JSON.parse(res.response).items,
      cost: res.cost,
    };
  }
}
