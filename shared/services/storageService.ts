/**
 * Storage Service
 * Abstraction layer for localStorage/sessionStorage with fallbacks
 */

export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = typeof window !== 'undefined' ? localStorage : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error('Storage access failed:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error('Storage access failed:', error);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Storage access failed:', error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Storage access failed:', error);
    }
  }
}