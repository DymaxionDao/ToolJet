import { SsoSyncController } from '@controllers/sso_sync.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SsoSyncService } from '@services/sso_sync.service';
import { App } from 'src/entities/app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([App])],
  providers: [SsoSyncService],
  controllers: [SsoSyncController],
})
export class SsoModule {}
