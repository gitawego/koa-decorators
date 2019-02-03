import Koa, { Middleware } from 'koa';
import * as https from 'https';
import { router } from './router';
import { promisify } from 'util';
export interface ServerOptions {
  host?: string;
  port?: number;
  ssl?: SSLOptions;
}
export interface SSLOptions {
  crt: string;
  key: string;
}
export class ServerLoader {
  server: Koa;
  async start() {
    console.log('to be implemented');
  }
  onServerStarted() {
    console.log('to be implemented');
  }
  onServerFailed(err: any) {
    console.log('to be implemented', err);
  }
}
export interface ServerClass extends ServerLoader {
  new (...args: any[]): {};
}
export function ServerSettings<R extends new (...args: any[]) => ServerLoader>(
  options: ServerOptions,
  middlewares: Middleware[] = []
) {
  return function Setting(constructor: R) {
    return class extends constructor {
      server: Koa;
      onServerStarted() {
        super.onServerStarted();
      }
      onServerFailed(err: any) {
        super.onServerFailed(err);
      }

      async start() {
        try {
          this.server = new Koa();
          if (middlewares.length > 0) {
            middlewares.forEach(middleware => this.server.use(middleware));
          }
          this.server.use(router.routes()).use(router.allowedMethods());
          const serverCallback = this.server.callback();
          if (options.ssl) {
            const httpsServer = https.createServer(options.ssl, serverCallback);
            const listen = promisify<number, string, any>(
              httpsServer.listen.bind(httpsServer)
            );
            await listen(options.port, options.host);
          } else {
            const listen = promisify<number, string, any>(
              this.server.listen.bind(this.server)
            );
            await listen(options.port, options.host);
          }
          const protocol = options.ssl ? 'https' : 'http';
          console.log(
            `HTTP server OK: ${protocol}://${options.host}:${options.port}`
          );
          if (this.onServerStarted) {
            this.onServerStarted();
          }
        } catch (err) {
          if (this.onServerFailed) {
            this.onServerFailed(err);
          }
        }
      }
    };
  };
}
