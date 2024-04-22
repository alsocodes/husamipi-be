import { BadRequestException } from '@nestjs/common';

export class ContstraintsException extends BadRequestException {
  constructor() {
    super('Cabang tidak bisa dihapus, karena masih digunakan');
  }
}
