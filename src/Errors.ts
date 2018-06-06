import {Errors as ErrorsInterface} from '../index';

export default class Errors implements ErrorsInterface {
  public errors: object;

  /**
   * Errors constructor.
   *
   * @param {object} errors
   */
  public constructor(errors: object = {}) {
    this.record(errors);
  }

  /**
   * Record errors.
   *
   * @param {object} errors
   *
   * @returns {void}
   */
  public record(errors: object = {}): void {
    this.errors = errors;
  }

  /**
   * Has errors in the field.
   *
   * @param {string} field
   *
   * @returns {boolean}
   */
  public has(field: string): boolean {
    return this.errors.hasOwnProperty(field);
  }

  /**
   * Has any errors.
   *
   * @returns {void}
   */
  public any(): boolean {
    return 0 < Object.keys(this.errors).length;
  }

  /**
   * Get filed errors.
   *
   * @param {string} field
   *
   * @returns {string[] | string | undefined}
   */
  public get(field: string): string[] | string | undefined {
    return this.errors[field];
  }

  /**
   * Get first filed error.
   *
   * @param {string} field
   *
   * @returns {string | undefined}
   */
  public getFirst(field: string): string | undefined {
    const filedErrors = this.get(field);

    return Array.isArray(filedErrors) ? filedErrors[0] : filedErrors;
  }

  /**
   * Clear errors.
   *
   * @param {string|null} field
   *
   * @returns {void}
   */
  public clear(field?: string): void {
    if (field) {
      delete this.errors[field];
    } else {
      this.record();
    }
  }
}
