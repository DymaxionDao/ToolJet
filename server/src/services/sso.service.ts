import { Injectable } from '@nestjs/common';

// import { HttpService } from '@nestjs/axios';

@Injectable()
export class SsoService {
  // constructor(private httpService: HttpService) {}

  async getUser(tokken: string) {
    // const data = await this.httpService.post(process.env.SSO_URL + '?/sso/user?tookken=' + tokken);
    console.log('Sta');
    return {};
  }
}
