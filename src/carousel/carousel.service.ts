import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarouselItemDto } from './dto/create-carousel-item.dto';
import { UpdateCarouselItemDto } from './dto/update-carousel-item.dto';

@Injectable()
export class CarouselService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.carouselItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.carouselItem.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.carouselItem.findUnique({
      where: { id },
    });
  }

  async create(createCarouselItemDto: CreateCarouselItemDto) {
    return this.prisma.carouselItem.create({
      data: {
        ...createCarouselItemDto,
        actionType: createCarouselItemDto.actionType || 'INTERNAL',
        isActive: createCarouselItemDto.isActive ?? true,
        sortOrder: createCarouselItemDto.sortOrder ?? 0,
      },
    });
  }

  async update(id: string, updateCarouselItemDto: UpdateCarouselItemDto) {
    return this.prisma.carouselItem.update({
      where: { id },
      data: updateCarouselItemDto,
    });
  }

  async remove(id: string) {
    return this.prisma.carouselItem.delete({
      where: { id },
    });
  }
}
