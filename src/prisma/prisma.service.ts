// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type findAndCountAllType = {
  table: any;
  select?: any;
  take: number;
  skip: number;
  where?: any;
  orderBy?: any;
  include?: any;
};

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super();
    // this.$use(SoftDeleteMiddleware);
  }
  // async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });
  // }

  async findAndCountAll(prismaObject: findAndCountAllType) {
    let { table, where, ...object } = prismaObject;

    const count = await table.aggregate({
      where,
      _count: { id: true },
    });

    const results = await table.findMany({ ...object, where });

    return {
      count: count._count.id,
      rows: results,
    };
  }
}
/*
const SoftDeleteMiddleware = async (params, next) => {
  if (params.action === 'findUnique' || params.action === 'findFirst') {
    // Change to findFirst - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'findFirst';
    // Add 'deleted' filter
    // ID filter maintained
    params.args.where['deletedAt'] = null;
  }
  if (params.action === 'findMany') {
    // Find many queries
    if (params.args.where) {
      if (params.args.where.deletedAt == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }
  if (params.action === 'aggregate') {
    // Find many queries
    if (params.args.where) {
      if (params.args.where.deletedAt == undefined) {
        // Exclude deleted records if they have not been explicitly requested
        params.args.where['deletedAt'] = null;
      }
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  if (params.action == 'update') {
    // Change to updateMany - you cannot filter
    // by anything except ID / unique with findUnique
    params.action = 'updateMany';
    // Add 'deleted' filter
    // ID filter maintained
    params.args.where['deletedAt'] = null;
  }
  if (params.action == 'updateMany') {
    if (params.args.where != undefined) {
      params.args.where['deletedAt'] = null;
    } else {
      params.args['where'] = { deletedAt: null };
    }
  }

  if (params.action == 'delete') {
    // Delete queries
    // Change action to an update
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }
  if (params.action == 'deleteMany') {
    // Delete many queries
    params.action = 'updateMany';
    if (params.args.data != undefined) {
      params.args.data['deletedAt'] = new Date();
    } else {
      params.args['data'] = { deletedAt: new Date() };
    }
  }
  return next(params);
} */
