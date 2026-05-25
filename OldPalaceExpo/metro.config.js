const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase Realtime Database includes Node.js-only WebSocket packages
// (faye-websocket / websocket-driver) that crash when bundled for web.
// Stub them out so the browser falls back to its native WebSocket API.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'websocket-driver' || moduleName === 'websocket')) {
    return { type: 'empty' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
