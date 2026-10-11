import { Global, Module } from '@nestjs/common';
import { PG_CONNECTION, DRIZZLE_DB, pool, db } from './index.js';

@Global()
@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      useValue: pool,
    },
    {
      provide: DRIZZLE_DB,
      useValue: db,
    },
  ],
  exports: [PG_CONNECTION, DRIZZLE_DB],
})
export class DbModule {}
