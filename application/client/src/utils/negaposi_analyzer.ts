/**
 * テキストの感情分析ユーティリティ。
 * kuromoji と negaposi-analyzer-ja は使用時のみ動的ロードする。
 */

type SentimentResult = {
  score: number;
  label: "positive" | "negative" | "neutral";
};

/** テキストの感情分析を行い、スコアとラベルを返す */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const kuromoji = await import("kuromoji");
  const { default: analyze } = await import("negaposi-analyzer-ja");

  const tokenizer = await new Promise<ReturnType<ReturnType<typeof kuromoji.builder>["build"]> extends void ? never : any>(
    (resolve, reject) => {
      kuromoji.builder({ dicPath: "/dicts" }).build((err: Error | null, tokenizer: any) => {
        if (err) reject(err);
        else resolve(tokenizer);
      });
    },
  );

  const tokens = tokenizer.tokenize(text);
  const score = analyze(tokens);

  let label: SentimentResult["label"];
  if (score > 0.1) {
    label = "positive";
  } else if (score < -0.1) {
    label = "negative";
  } else {
    label = "neutral";
  }

  return { score, label };
}
