import { Controller, Get, Post } from '../../src/router';
import { ServerSettings } from '../../src/ServerSetting';
import Koa from 'koa';
@ServerSettings({
  port: 3000,
  host: '0.0.0.0'
})
class Server {
  server: Koa;
  // public async initPlugins() {
  //   // await this.server.register(inert);
  // }
  onServerFailed(err: any) {}
  onServerStarted() {
    console.log(`server started `);
  }
}

@Controller('/api/user')
class UserApi extends Api {
  constructor(private id: string) {
    super();
  }
  @Get('')
  getUserById() {
    return this.id;
  }

  @Post('/{id}')
  updateUserId() {
    // todo
  }
}

@Controller('/api/vote')
class Vote extends Api {
  @Get('/all')
  getAllVotes(req: Request, h: ResponseToolkit) {
    // ...
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
