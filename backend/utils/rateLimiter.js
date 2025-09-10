// Rate limiting to prevent spam
const rateLimits = new Map();

export const rateLimiter = (socketId, eventType, limit = 10, windowMs = 1000) => {
  const key = `${socketId}:${eventType}`;
  const now = Date.now();
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const limiter = rateLimits.get(key);
  
  if (now > limiter.resetTime) {
    limiter.count = 1;
    limiter.resetTime = now + windowMs;
    return true;
  }
  
  if (limiter.count >= limit) {
    return false;
  }
  
  limiter.count++;
  return true;
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, limiter] of rateLimits.entries()) {
    if (now > limiter.resetTime) {
      rateLimits.delete(key);
    }
  }
}, 60000); // Clean every minute
