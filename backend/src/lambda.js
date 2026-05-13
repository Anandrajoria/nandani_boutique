const serverless = require('serverless-http');
const app = require('./app');
const { connectDB } = require('./config/db');

let isConnected = false;

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  // Strip stage prefix from path
  if (event.rawPath) {
    event.rawPath = event.rawPath.replace(/^\/production/, '');
  }
  if (event.requestContext?.http?.path) {
    event.requestContext.http.path = event.requestContext.http.path.replace(/^\/production/, '');
  }

  const handler = serverless(app);
  return handler(event, context);
};
