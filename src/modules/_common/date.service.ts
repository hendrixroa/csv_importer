import { Injectable } from '@nestjs/common';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

@Injectable()
export class DateService {
  public static toUSAString(date?: Date): string {
    if (!date) {
      date = new Date();
    }
    const dateFormatted = this.formatDate(date);
    return `${dateFormatted.month}-${dateFormatted.day}-${dateFormatted.year}`;
  }

  public static toString(date?: Date): string {
    if (!date) {
      date = new Date();
    }
    const dateFormatted = this.formatDate(date);
    return `${dateFormatted.year}-${dateFormatted.month}-${dateFormatted.day}`;
  }

  public static formatDate(date: Date): {
    day: string;
    month: string;
    year: string;
  } {
    const year = date.getFullYear();
    const month = [10, 11].includes(date.getUTCMonth())
      ? date.getUTCMonth()
      : `0${date.getUTCMonth() + 1}`;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    return {
      day: `${day}`,
      month: `${month}`,
      year: `${year}`,
    };
  }

  public static calculateExpiration(dateTimeout: string | Date): number {
    return Math.floor(
      (new Date(dateTimeout).getTime() - new Date().getTime()) / 60000,
    );
  }

  public static isValidDate(date: string): Date | null {
    const dateParsed = new Date(date);
    return isNaN(dateParsed.getTime()) ? null : dateParsed;
  }

  public static humanizeDate(date: Date): string {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as DateTimeFormatOptions;
    return new Date(date).toLocaleDateString(undefined, options);
  }

  public static getPreviousDateIn(date: Date, days: number): Date {
    const dateParam = new Date(date);
    dateParam.setDate(dateParam.getDate() - days);
    return dateParam;
  }
}
