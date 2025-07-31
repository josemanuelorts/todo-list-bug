import { Body, Controller, Get, Param, Post, Req, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EditTaskDto } from './dto/edit-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Get('')
    async listTasks(@Req() req) {
        const userId = req.user.id;
        return this.tasksService.listTasks(userId);
    }

    @Get('/:id')
    async getTask(@Param('id') id: string, @Req() req) {
        const userId = req.user.id;
        return this.tasksService.getTask(id, userId);
    }

    @Post('/edit')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async editTask(@Body() editTaskDto: EditTaskDto, @Request() req) {
        return this.tasksService.editTask(editTaskDto, req.user.id);
    }
}