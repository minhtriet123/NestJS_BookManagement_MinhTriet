import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Author } from './author.entity';
import { AuthorsService } from './authors.service';
import { AuthorDto } from './dto/author.dto';

@Controller('api/authors')
@UseGuards(AuthGuard('jwt'))
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}
  @Post('/create-author')
  createCategory(@Body() createAuthorDto: AuthorDto): Promise<AuthorDto> {
    return this.authorsService.createAuthor(createAuthorDto);
  }

  @Delete('/:id')
  deteleBook(@Param('id') id: string): Promise<Author> {
    return this.authorsService.deleteAuthor(id);
  }

  @Put('/:id')
  updateAuthor(
    @Param('id') id: string,
    @Body() AuthorDto: AuthorDto,
  ): Promise<Author> {
    return this.authorsService.updateAuthor(id, AuthorDto);
  }
}
