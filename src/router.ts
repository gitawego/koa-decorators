import { Middleware } from 'koa';
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

export const router = new Router();

/**
 * applied to class
 * @param path
 * @param middlewares
 */
export function Controller(path: string, middlewares: Middleware[] = []) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      router: Router;
      constructor(...args: any[]) {
        super(...args);
        if (!this.router) {
          this.router = new Router();
        }
        if (middlewares.length > 0) {
          this.router.use(...middlewares);
        }
        router.use(path, this.router.routes(), this.router.allowedMethods());
      }
    };
  };
}

// @Router decorator
export function Route(
  path: string,
  method: HttpMethod,
  middleware: Middleware[] = []
) {
  return (target: any, key?: string | symbol, descriptor?: any): void => {
    if (!target.router) {
      target.router = new Router();
    }
    const fnc = target[key].bind(target);
    switch (method) {
      case HttpMethod.HEAD:
        target.router.head(path, ...middleware, fnc);
        break;
      case HttpMethod.OPTIONS:
        target.router.options(path, ...middleware, fnc);
        break;
      case HttpMethod.GET:
        target.router.get(path, ...middleware, fnc);
        break;
      case HttpMethod.PUT:
        target.router.put(path, ...middleware, fnc);
        break;
      case HttpMethod.PATCH:
        target.router.patch(path, ...middleware, fnc);
        break;
      case HttpMethod.POST:
        target.router.post(path, ...middleware, fnc);
        break;
      case HttpMethod.DELETE:
        target.router.del(path, ...middleware, fnc);
        break;
      default:
        target.router.all(path, ...middleware, fnc);
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
