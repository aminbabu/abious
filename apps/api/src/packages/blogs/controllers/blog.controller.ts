import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Header,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { BypassTransform } from '../../../common/decorators/bypass-transform.decorator.js';
import { BlogService } from '../services/blog.service.js';
import { CreateBlogPostDto, UpdateBlogPostDto } from '../dtos/blog.dto.js';

@Controller('api/blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @AllowAnonymous()
  async getPublished() {
    return this.blogService.getPublishedPosts();
  }

  @Get('rss.xml')
  @AllowAnonymous()
  @BypassTransform()
  @Header('Content-Type', 'application/xml')
  async getRss() {
    return this.blogService.generateRssFeed();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAll() {
    return this.blogService.getAllPosts();
  }

  @Get(':slug')
  @AllowAnonymous()
  async getOne(@Param('slug') slug: string) {
    return this.blogService.getPostBySlug(slug);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(
    @Body() body: CreateBlogPostDto,
    @Session() session: UserSession,
  ) {
    return this.blogService.createPost(body, session?.user?.id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBlogPostDto,
  ) {
    return this.blogService.updatePost(id, body);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.blogService.deletePost(id);
  }
}
