import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CreateCarouselItemDto } from './dto/create-carousel-item.dto';
import { UpdateCarouselItemDto } from './dto/update-carousel-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, UserRole } from '../auth/decorators/roles.decorator';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async findAll() {
    const items = await this.carouselService.findAll();
    return {
      success: true,
      data: items,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin() {
    const items = await this.carouselService.findAllAdmin();
    return {
      success: true,
      data: items,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createCarouselItemDto: CreateCarouselItemDto) {
    const item = await this.carouselService.create(createCarouselItemDto);
    return {
      success: true,
      data: item,
      message: 'Carousel item created successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const item = await this.carouselService.findOne(id);
    return {
      success: true,
      data: item,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCarouselItemDto: UpdateCarouselItemDto,
  ) {
    const item = await this.carouselService.update(id, updateCarouselItemDto);
    return {
      success: true,
      data: item,
      message: 'Carousel item updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.carouselService.remove(id);
    return {
      success: true,
      message: 'Carousel item deleted successfully',
    };
  }
}
