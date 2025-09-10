// Performance monitoring utilities
export const performanceMonitor = {
  connections: 0,
  rooms: 0,
  messagesPerSecond: 0,
  messageCount: 0,
  startTime: Date.now(),

  incrementConnections() {
    this.connections++;
  },

  decrementConnections() {
    this.connections--;
  },

  updateRoomCount(count) {
    this.rooms = count;
  },

  incrementMessage() {
    this.messageCount++;
  },

  getStats() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const avgMessagesPerSecond = this.messageCount / Math.max(uptime, 1);
    
    return {
      connections: this.connections,
      rooms: this.rooms,
      totalMessages: this.messageCount,
      avgMessagesPerSecond: avgMessagesPerSecond.toFixed(2),
      uptimeSeconds: uptime,
    };
  },

  logStats() {
    console.log("📊 Performance Stats:", this.getStats());
  }
};

// Log stats every 30 seconds
setInterval(() => {
  performanceMonitor.logStats();
}, 30000);
