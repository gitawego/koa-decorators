import Koa from 'koa';
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
export function ServerSettings(options: ServerOptions) {
  return function Setting(constructor: any) {
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
          console.log(
            `HTTPS server OK: https://${options.host}:${options.port}`
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
