import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks(userId: string) {
        this.logger.log(`Listing tasks for userId: ${userId}`);
        const tasks = await this.tasksRepository.find({
            where: { ownerId: userId },
        });
        this.logger.log(`Found ${tasks.length} tasks for userId: ${userId}`);
        return tasks;
    }

    async getTask(id: string, userId: string) {
        this.logger.log(`Fetching task ${id} for userId: ${userId}`);
        const task = await this.tasksRepository.findOne({
            where: { id },
            select: ['id', 'title', 'description', 'done', 'dueDate', 'ownerId'],
        });

        if (!task) {
            this.logger.warn(`Task not found: ${id}`);
            throw new NotFoundException('Task not found');
        }

        if (task.ownerId !== userId) {
            this.logger.warn(`User ${userId} tried to access task ${id} without permission`);
            throw new ForbiddenException('You do not have access to this task');
        }

        this.logger.log(`Task ${id} retrieved successfully for userId: ${userId}`);
        return task;
    }

    async editTask(body: any, userId: string) {
        this.logger.log(`User ${userId} attempting to edit task ${body.id}`);

        const task = await this.tasksRepository.findOne({
            where: { id: body.id },
            relations: ['owner'],
        });

        if (!task) {
            this.logger.warn(`Task not found: ${body.id}`);
            throw new NotFoundException('Task not found');
        }

        if (task.owner.id !== userId) {
            this.logger.warn(`User ${userId} attempted to edit task ${body.id} without permission`);
            throw new ForbiddenException('You do not have permission to edit this task');
        }

        await this.tasksRepository.update(body.id, body);

        this.logger.log(`Task ${body.id} updated by user ${userId}`);

        const editedTask = await this.getTask(body.id, userId);

        return editedTask;
    }

}
