import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';

export interface AssetsServerConfig {
  port?: number;
  assetsPath?: string;
  enableCors?: boolean;
  enableCompression?: boolean;
  maxAge?: string;
}

export class AssetsServer {
  private app: express.Application;
  private config: Required<AssetsServerConfig>;

  constructor(config: AssetsServerConfig = {}) {
    this.config = {
      port: 3000,
      assetsPath: path.join(__dirname, '../assets'),
      enableCors: true,
      enableCompression: true,
      maxAge: '1d',
      ...config,
    };

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // 安全中间件
    this.app.use(helmet());

    // 启用 CORS
    if (this.config.enableCors) {
      this.app.use(cors());
    }

    // 启用压缩
    if (this.config.enableCompression) {
      this.app.use(compression());
    }
  }

  private setupRoutes(): void {
    // 健康检查
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // 静态资源服务
    this.app.use('/assets', express.static(this.config.assetsPath, {
      maxAge: this.config.maxAge,
      etag: true,
      lastModified: true,
    }));

    // 404 处理
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Resource not found' });
    });
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        console.log(`Assets server is running on port ${this.config.port}`);
        console.log(`Serving assets from: ${this.config.assetsPath}`);
        resolve();
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default AssetsServer; 