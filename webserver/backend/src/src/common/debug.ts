import { DEBUG_ACTIVE, DEBUG_LEVEL } from './config';

export function debug(...args: any[]): void {
  if (DEBUG_ACTIVE) {
    switch (DEBUG_LEVEL) {
        case 'log':   console.log(...args);   break;
        case 'info':  console.info(...args);  break;
        case 'warn':  console.warn(...args);  break;
        case 'error': console.error(...args); break;
        default:      console.debug(...args); break;
    }
  }
}
