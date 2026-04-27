import { Controller, Get } from '@nestjs/common';
import { SalesService } from './sales/sales.service';

@Controller()
export class AppController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  getHello(): string {
    return 'Sales API is running 🚀';
  }

  // 🔥 Example: test endpoint using SalesService
  @Get('summary')
  getSummary() {
    return this.salesService.summary();
  }
}
