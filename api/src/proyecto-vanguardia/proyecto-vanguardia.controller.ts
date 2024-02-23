import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProyectoVanguardiaService } from './proyecto-vanguardia.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from './dtos/rol.dto';
import { CreateGeneroDto } from './dtos/genero.dto';

@ApiTags('Proyecto Vanguardia - ATM')
@Controller('atm')
export class ProyectoVanguardiaController {
  constructor(private readonly pryVanguardiaSrv: ProyectoVanguardiaService) {}
  // ! Roles
  @Get('roles')
  async getRoles() {
    return await this.pryVanguardiaSrv.ROLES.getRoles();
  }
  @Get('roles/:id')
  async getRol(@Param('id', ParseIntPipe) id: number) {
    return await this.pryVanguardiaSrv.ROLES.getRolById(id);
  }
  @Post('roles')
  async crearRol(@Body() body: CreateRolDto) {
    return await this.pryVanguardiaSrv.ROLES.crearRol(body);
  }
  @Put('roles/:id')
  async actualizarRol(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateRolDto,
  ) {
    return await this.pryVanguardiaSrv.ROLES.editarRol({ id, ...body });
  }
  @Delete('roles/:id')
  async eliminarRol(@Param('id', ParseIntPipe) id: number) {
    return await this.pryVanguardiaSrv.ROLES.deleteRol(id);
  }

  // ! Generos
  @Get('generos')
  async getGeneros() {
    return await this.pryVanguardiaSrv.GENEROS.getGeneros();
  }
  @Get('generos/:id')
  async getGenero(@Param('id', ParseIntPipe) id: number) {
    return await this.pryVanguardiaSrv.GENEROS.getGeneroById(id);
  }
  @Post('generos')
  async crearGenero(@Body() body: CreateGeneroDto) {
    return await this.pryVanguardiaSrv.GENEROS.crearGenero(body);
  }
  @Put('generos/:id')
  async actualizarGenero(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateGeneroDto,
  ) {
    return await this.pryVanguardiaSrv.GENEROS.editarGenero({ id, ...body });
  }
  @Delete('generos/:id')
  async eliminarGenero(@Param('id', ParseIntPipe) id: number) {
    return await this.pryVanguardiaSrv.GENEROS.deleteGenero(id);
  }
}
