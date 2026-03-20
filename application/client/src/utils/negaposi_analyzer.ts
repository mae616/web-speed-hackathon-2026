import kuromoji, { type Tokenizer, type IpadicFeatures } from "kuromoji";
import analyze from "negaposi-analyzer-ja";

/** kuromoji トークナイザーをPromiseで初期化する（Bluebird不要） */
function getTokenizer(): Promise<Tokenizer<IpadicFeatures>> {
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: "/dicts" }).build((err, tokenizer) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokenizer);
      }
    });
  });
}

type SentimentResult = {
  score: number;
  label: "positive" | "negative" | "neutral";
};

/** テキストの感情分析を行い、スコアとラベルを返す */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const tokenizer = await getTokenizer();
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
