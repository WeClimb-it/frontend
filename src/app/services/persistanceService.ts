import Cookies from 'js-cookie';
import { isNumber } from 'lodash';

export class PersistanceService {
  static hasLocalStorage: boolean = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  /**
   *
   */
  static get(key: string): string | boolean | number | null | undefined {
    const value = this.hasLocalStorage ? window.localStorage.getItem(key) : Cookies.get(key);

    if (value == null || typeof value === 'undefined') {
      return value;
    }

    let output: string | boolean | number = value;

    if (isNumber(output)) {
      output = +output;
    } else if (output === 'false') {
      return false;
    } else if (output === 'true') {
      return true;
    } else {
      output = String(output);
    }

    return output;
  }

  /**
   *
   */
  static set(key: string, value: string) {
    if (this.hasLocalStorage) {
      window.localStorage.setItem(key, value);
    } else {
      Cookies.set(key, value);
    }
  }

  /**
   *
   */
  static unset(key: string) {
    if (this.hasLocalStorage) {
      window.localStorage.removeItem(key);
    } else {
      Cookies.remove(key);
    }
  }
}
