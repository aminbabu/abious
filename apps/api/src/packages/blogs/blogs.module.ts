import { Module, DynamicModule } from '@nestjs/common';
import { BlogRepository } from './repositories/blog.repository.js';
import { BlogService } from './services/blog.service.js';
import { BlogController } from './controllers/blog.controller.js';

@Module({
  controllers: [BlogController],
  providers: [BlogRepository, BlogService],
  exports: [BlogService, BlogRepository],
})
export class BlogsModule {
  static forRoot(): DynamicModule {
    return {
      module: BlogsModule,
      controllers: [BlogController],
      providers: [BlogRepository, BlogService],
      exports: [BlogService, BlogRepository],
    };
  }
}
