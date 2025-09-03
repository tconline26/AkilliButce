import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from 'http';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the full error for debugging
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      table: err.table,
      constraint: err.constraint,
      column: err.column,
      dataType: err.dataType,
      routine: err.routine,
    });

    res.status(status).json({ message });
    // Don't throw here as it would crash the server
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Function to find an available port
  const getAvailablePort = async (startPort: number): Promise<number> => {
    const httpServer = createServer();
    
    return new Promise((resolve, reject) => {
      const onError = (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          httpServer.close();
          resolve(getAvailablePort(startPort + 1));
        } else {
          reject(err);
        }
      };

      httpServer.on('error', onError);
      
      httpServer.listen(startPort, () => {
        const address = httpServer.address();
        const port = typeof address === 'string' ? parseInt(address.split(':').pop() || '5000', 10) : address?.port || startPort;
        httpServer.close(() => resolve(port));
      });
    });
  };

  // Get port from environment or use a default range
  const startPort = parseInt(process.env.PORT || '5000', 10);
  
  try {
    const port = await getAvailablePort(startPort);
    server.listen({
      port,
      host: "127.0.0.1",
    }, () => {
      log(`Server is running on http://localhost:${port}`);
      log(`Press Ctrl+C to stop the server`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
