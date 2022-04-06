import { getLogger as getLog4JsLogger } from 'log4js';

const logger = getLogger();

// Set fallback level, should be overridden by config
logger.level = 'info';

export default logger;

export function getLogger(category?: string) {
  return getLog4JsLogger(category);
}
