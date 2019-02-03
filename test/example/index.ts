import { Controller, Get, Post } from '../../src/router';
import { ServerSettings, ServerLoader } from '../../src/ServerSetting';
import Koa, { Context } from 'koa';
@ServerSettings({
  port: 3000,
  host: '0.0.0.0'
})
class Server extends ServerLoader {
  server: Koa;
  onServerFailed(err: any) {}
  onServerStarted() {
    console.log(`server started `);
  }
}

@Controller('/api/user')
class UserApi {
  constructor(private id: string) {}
  @Get('/')
  async getUserById(ctx: Context, next: any) {
    ctx.body = this.id;
    await next();
  }

  @Post('/{id}')
  updateUserId() {
    // todo
  }
}

@Controller('/api/vote')
class Vote {
  @Get('/all')
  async getAllVotes(ctx: Context, next: any) {
    ctx.body = 'all';
    await next();
  }
  @Post('')
  addVote() {
    // ...
  }
}

const user = new UserApi('test');
const vote = new Vote();
console.log(user, vote);
const server = new Server();
server.start();
