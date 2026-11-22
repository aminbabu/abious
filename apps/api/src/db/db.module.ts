import { Global, Module } from '@nestjs/common';
import { SQLITE_CONNECTION, DRIZZLE_DB, sqlite, db } from './index.js';

@Global()
@Module({
  providers: [
    {
      provide: SQLITE_CONNECTION,
      useValue: sqlite,
    },
    {
      provide: DRIZZLE_DB,
      useValue: db,
    },
  ],
  exports: [SQLITE_CONNECTION, DRIZZLE_DB],
})
export class DbModule {}
