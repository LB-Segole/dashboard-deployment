import natural from 'natural';
import { stopwords } from 'natural/lib/natural/util/stopwords';

export class TextProcessing {
  private static tokenizer = new natural.WordTokenizer();
  private static stemmer = natural.PorterStemmer;

  static tokenize(text: string): string[] {
    return this.tokenizer.tokenize(text.toLowerCase());
  }

  static removeStopWords(tokens: string[]): string[] {
    return tokens.filter((token) => !stopwords.words.includes(token));
  }

  static stem(tokens: string[]): string[] {
    return tokens.map((token) => this.stemmer.stem(token));
  }

  static extractKeywords(text: string, count = 5): string[] {
    const tokens = this.tokenize(text);
    const filtered = this.removeStopWords(tokens);
    const stemmed = this.stem(filtered);

    const frequency: Record<string, number> = {};
    stemmed.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word);
  }
}