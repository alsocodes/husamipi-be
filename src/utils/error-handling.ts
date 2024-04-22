import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ErrorHandling {
  constructor(error?: string | object | any) {
    // known errors handling
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, meta }: Prisma.PrismaClientKnownRequestError = error;
      // console.log('herex', code, meta);

      if (code === 'P2003') {
        let message = 'Data tidak bisa dihapus';
        const { modelName, field_name } = meta;
        if (modelName === 'Role' && field_name === 'User_roleId_fkey (index)')
          message = 'Role tidak bisa dihapus, role masih aktif digunakan';
        throw new BadRequestException(message);
      }

      if (code === 'P2002') {
        const { target }: any = meta;
        const message = target?.join(', ');
        throw new ConflictException(`${message} sudah digunakan`);
      }

      if (code === 'P2025') {
        throw new NotFoundException(
          'Data yang akan dihapus/diupdate tidak ditemukan',
        );
      }
    }

    // unknown errors handling
    if (error instanceof Prisma.PrismaClientValidationError) {
      const { message }: Prisma.PrismaClientValidationError = error;
      const keyUnknown = 'Unknown arg `';
      if (message.includes(keyUnknown)) {
        const pos = message.indexOf(keyUnknown) + keyUnknown.length;
        let messageInfo = message.substring(pos);
        messageInfo = messageInfo.substring(0, messageInfo.indexOf('`'));
        throw new BadRequestException(`Parameter ${messageInfo} tidak valid`);
      }

      const keyMissing = 'missing';
      if (message.includes(keyMissing)) {
        throw new BadRequestException(`Parameter required harus diisi`);
      }

      // nanti kalau ketemu error unknown lainnya bisa ditambah lagi disini
    }
    if (error instanceof NotFoundException)
      throw new NotFoundException(error.message || 'Data tidak ditemukan');

    throw error;
    // throw new InternalServerErrorException('Terjadi kesalahan');
  }
}
