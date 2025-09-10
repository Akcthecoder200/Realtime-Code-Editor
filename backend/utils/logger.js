// Simple logger utility
export const logger = {
  info: (message, data = {}) => {
    console.log(`ℹ️  [${new Date().toISOString()}] ${message}`, data);
  },
  error: (message, error = {}) => {
    console.error(`❌ [${new Date().toISOString()}] ${message}`, error);
  },
  success: (message, data = {}) => {
    console.log(`✅ [${new Date().toISOString()}] ${message}`, data);
  },
  warn: (message, data = {}) => {
    console.warn(`⚠️  [${new Date().toISOString()}] ${message}`, data);
  }
};
