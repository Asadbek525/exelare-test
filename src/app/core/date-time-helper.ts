export class DateTimeHelper {
  /**
   * Gets the UTC offset in minutes.
   * JavaScript's getTimezoneOffset() returns offset in minutes, with opposite sign.
   * For UTC+5, getTimezoneOffset() returns -300, so we return 300.
   */
  static getUtcOffSet(): number {
    return new Date().getTimezoneOffset();
  }

  /**
   * Gets the UTC offset in hours for API calls.
   * Returns a value between -14 and +14.
   * For UTC+5, this returns 5.
   */
  static getUtcOffsetInHours(): number {
    const offsetMinutes = new Date().getTimezoneOffset();
    // getTimezoneOffset returns minutes behind UTC (negative for ahead)
    // We need positive for timezones ahead of UTC
    const offsetHours = -offsetMinutes / 60;
    // Clamp to valid range
    return Math.max(-14, Math.min(14, offsetHours));
  }
}
