import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AccessGuard } from './auth/access.guard';
import { ForumModule } from './forum/forum.module';
import { MateriModule } from './materi/materi.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// import { MenuModule } from './menu/menu.module';
// import { DivisionModule } from './division/division.module';
// import { TicketModule } from './ticket/ticket.module';
// import { TicketIssueModule } from './ticket-issue/ticket-issue.module';
// import { DashboardModule } from './dashboard/dashboard.module';
// import { AngpenTypeModule } from './angpen-type/angpen-type.module';
// import { AngpenTransactionModule } from './angpen-transaction/angpen-transaction.module';
// import { TrainModule } from './train/train.module';
// import { StationModule } from './station/station.module';
// import { CQIK2StationModule } from './cqik2-station/cqik2-station.module';
// import { CQITrainModule } from './cqi-train/cqi-train.module';

@Module({
  imports: [
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../storage/attachment'),
      serveRoot: '/storage/attachment/',
    }),
    UserModule,
    AuthModule,
    RoleModule,
    ForumModule,
    MateriModule,
    // MenuModule,
    // DivisionModule,
    // TicketModule,
    // TicketIssueModule,
    // DashboardModule,
    // AngpenTypeModule,
    // AngpenTransactionModule,
    // TrainModule,
    // StationModule,
    // CQIK2StationModule,
    // CQITrainModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
