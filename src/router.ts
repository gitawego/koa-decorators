import { Context, Middleware } from 'koa';
import Router from 'koa-router';

export enum HttpMethod {
  HEAD,
  OPTIONS,
  GET,
  PUT,
  PATCH,
  POST,
  DELETE,
  ALL
}

async function formatResponse(descriptor: any, ctx: Context) {
  const ret = descriptor.value(ctx);
  if (ret != null) {
    const data = await Promise.resolve(ret);
    if (data != null) {
      ctx.body = {
        data
      };
    }
  }
}

export const router = new Router();

export function Controller(path: string, middleware: Middleware[] = []) {
  return (target: any) => {
    if (!target.prototype.router) {
      target.prototype.router = new Router();
    }
    if (middleware.length > 0) {
      target.prototype.router.use(...middleware);
    }
    router.use(
      path,
      target.prototype.router.routes(),
      target.prototype.router.allowedMethods()
    );
    return;
  };
}

// @Router decorator
export function Route(
  path: string,
  method: HttpMethod,
  middleware: Middleware[] = []
) {
  return (target: any, key?: string | symbol, descriptor?: any): void => {
    // Decorator applied to Class (for Constructor injection).
    if (!target.router) {
      target.router = new Router();
    }
    const handleReturnMiddleware = async (ctx: Context) => {
      await formatResponse(descriptor, ctx);
    };
    // Decorator applied to member (method or property).
    switch (method) {
      case HttpMethod.HEAD:
        target.router.head(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.OPTIONS:
        target.router.options(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.GET:
        target.router.get(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.PUT:
        target.router.put(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.PATCH:
        target.router.patch(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.POST:
        target.router.post(path, ...middleware, handleReturnMiddleware);
        break;
      case HttpMethod.DELETE:
        target.router.del(path, ...middleware, handleReturnMiddleware);
        break;
      default:
        target.router.all(path, ...middleware, handleReturnMiddleware);
        break;
    }
  };
}

export function Get(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.GET, middleware);
}

export function Post(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.POST, middleware);
}

export function Put(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.PUT, middleware);
}

export function Patch(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.PATCH, middleware);
}

export function Options(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.OPTIONS, middleware);
}

export function Head(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.HEAD, middleware);
}

export function Delete(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.DELETE, middleware);
}

export function All(path: string, middleware: Middleware[] = []) {
  return Route(path, HttpMethod.ALL, middleware);
}
