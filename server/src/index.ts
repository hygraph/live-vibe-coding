import express from 'express';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Create Express app
const app = express();
const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // Enable graceful server shutdown
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
  // Enable GraphQL Playground in development
  introspection: true,
  csrfPrevention: false, // Disable CSRF for development
});

async function startServer() {
  // Start Apollo Server
  await server.start();

  // Apply middleware
  app.use(morgan('combined')); // HTTP request logging

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        // Context can be extended here with user auth, etc.
        req,
      }),
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Basic error handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? err.message
            : 'Something went wrong',
      });
    }
  );

  const PORT = process.env.PORT || 4000;

  await new Promise<void>(resolve =>
    httpServer.listen({ port: PORT }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
