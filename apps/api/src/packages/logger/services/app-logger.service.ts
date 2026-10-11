import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

@Injectable()
export class AppLoggerService implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels;
  }

  log(message: any, context?: string) {
    if (this.logLevels.includes('log')) {
      this.print('INFO', message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.logLevels.includes('error')) {
      this.print('ERROR', message, context, trace);
    }
  }

  warn(message: any, context?: string) {
    if (this.logLevels.includes('warn')) {
      this.print('WARN', message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.logLevels.includes('debug')) {
      this.print('DEBUG', message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.logLevels.includes('verbose')) {
      this.print('VERBOSE', message, context);
    }
  }

  private print(level: string, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const formatted = typeof message === 'object' ? JSON.stringify(message) : message;
    const ctx = context ? ` [${context}]` : '';
    console.log(`[${timestamp}] [${level}]${ctx} ${formatted}`);
    if (trace) {
      console.error(trace);
    }
  }
}
