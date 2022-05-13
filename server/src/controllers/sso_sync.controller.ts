import { NewAppDto } from '@dto/new-app.dto';
import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { SsoSyncService } from '@services/sso_sync.service';

@Controller('ssosync')
export class SsoSyncController {
  constructor(private ssoSyncService: SsoSyncService) {}
  @Get('')
  async getApps(@Request() req) {
    const result = await this.ssoSyncService.getApps();
    return result;
  }

  @Post('/new')
  async newApp(@Body() body: NewAppDto) {
    const result = await this.ssoSyncService.newApp(body);
    return result;
  }
  @Delete('/delete/:id')
  async deleteApp(@Param('id') appid: string) {
    const result = await this.ssoSyncService.deteleApp(appid);
    return result;
  }

  @Get('/app/:id')
  async getApp(@Param('id') appid: string) {
    const result = await this.ssoSyncService.getApp(appid);
    return result;
  }
}
