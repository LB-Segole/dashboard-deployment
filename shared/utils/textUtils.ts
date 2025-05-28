/**
 * Text Processing Utilities
 */

export class TextUtils {
  static truncate(text: string, maxLength: number, ellipsis = '...'): string {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}${ellipsis}`;
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static titleCase(text: string): string {
    return text
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static countWords(text: string): number {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  static countCharacters(text: string): number {
    return text.length;
  }

  static extractEmails(text: string): string[] {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return text.match(emailRegex) || [];
  }

  static highlightKeywords(
    text: string,
    keywords: string[],
    highlightClass = 'highlight'
  ): string {
    if (!keywords.length) return text;

    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    return text.replace(
      regex,
      `<span class="${highlightClass}">$1</span>`
    );
  }
}