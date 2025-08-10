import {Controller, Get, Post, Put, Delete, Inject, UseGuards, ParseIntPipe, Param, Body} from "@nestjs/common";
import type {ClassServiceI} from "@/shares";
import {ClassServiceToken, Role} from "@/shares";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@/modules/auth/guard";
import {Roles} from "@/modules/auth/roles.decorator";
import {RolesGuard} from "@/modules/auth/roles.guard";
import {ClassReq} from "@/modules/class/dtos";

@ApiTags('Class')
@Controller('class')
@ApiBearerAuth()
@Roles(Role.TEACHER, Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class ClassController {
    constructor(
        @Inject(ClassServiceToken)
        private readonly classService: ClassServiceI,
    ) {}

    @Get()
    findAll() {
        return this.classService.find();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.classService.findOne(id);
    }

    @Post()
    create(@Body() data: ClassReq) {
        return this.classService.createAndJoinClass(data);
    }

    @Put(':id')
    updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: ClassReq) {
        return this.classService.updateOne(id, data);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.classService.softDelete(id);
    }
}