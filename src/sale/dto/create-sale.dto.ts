import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

class SaleDetail {
  @IsNotEmpty({ message: 'Produk harus diisi' })
  productId: number;

  @IsNotEmpty({ message: 'Qty harus diisi' })
  qty: number;

  @IsNotEmpty({ message: 'Harga harus diisi' })
  price: number;

  @IsOptional()
  ppn: number;
}

export class CreateSaleDTO {
  @IsNotEmpty({ message: 'Tanggal harus diisi' })
  date: Date;

  @IsNotEmpty({ message: 'Nomor SO harus diisi' })
  soNumber: string;

  @IsNotEmpty({ message: 'No Invoice harus diisi' })
  invoiceNumber: string;

  @IsNotEmpty({ message: 'Customer harus diisi' })
  customer: string;

  @IsArray()
  @ArrayMinSize(1)
  saleDetails: SaleDetail[];
}
