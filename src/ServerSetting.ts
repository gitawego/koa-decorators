import Koa from 'koa';
import * as https from 'https';

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
    constructor.prototype.start = async function() {
      try {
        this.server = new Koa();
        if (this.initPlugins) {
          await this.initPlugins(this.server);
        }
        this.server.route(routeSettings());
        if (this.initRoutes) {
          await this.initRoutes(this.server);
        }
        await this.server.start();
        this.onServerStarted(this.server);
      } catch (err) {
        this.onServerFailed(err);
      }
    };
  };
}
