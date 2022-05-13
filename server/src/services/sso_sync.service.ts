import { NewAppDto } from '@dto/new-app.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from 'src/entities/app.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SsoSyncService {
  constructor(
    @InjectRepository(App)
    private appsRepository: Repository<App>
  ) {}
  async getApps() {
    const apps = await this.appsRepository.createQueryBuilder().select().limit(1).getMany();

    return {
      data: apps,
      message: 'success',
      status: 200,
    };
  }

  async newApp(requestBody: NewAppDto) {
    requestBody.is_public = false;
    const newApp = await this.appsRepository.create(requestBody);

    return {
      data: newApp,
      message: 'success',
      status: 201,
    };
  }

  async deteleApp(appId: string) {
    try {
      const status = await this.appsRepository.delete({ id: appId });

      return {
        data: status,
        message: 'success',
        status: 201,
      };
    } catch (e) {
      return {
        message: 'Error Deleting App',
        error: e,
        status: 201,
      };
    }
  }

  async getApp(appId: string) {
    const app = await this.appsRepository.findOne({ id: appId });

    return {
      data: app,
      message: 'success',
      status: 200,
    };
  }
}
