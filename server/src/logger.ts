import { getLogger } from 'log4js';

const logger = getLogger();

// Set fallback level, should be overridden by config
logger.level = 'info';

export default logger;
