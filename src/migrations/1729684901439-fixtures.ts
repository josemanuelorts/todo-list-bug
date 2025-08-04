import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

export class Fixtures1729684901439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Hashear las contraseñas manualmente
    const alicePassword = await bcrypt.hash('alice123', 10);
    const bobPassword = await bcrypt.hash('bob123', 10);
    const charliePassword = await bcrypt.hash('charlie123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const usersToInsert = [
      {
        fullname: 'Alice Johnson',
        email: 'alice@example.com',
        pass: alicePassword,
        role: 'user',
      },
      {
        fullname: 'Bob Smith',
        email: 'bob@example.com',
        pass: bobPassword,
        role: 'user',
      },
      {
        fullname: 'Charlie Brown',
        email: 'charlie@example.com',
        pass: charliePassword,
        role: 'user',
      },
      {
        fullname: 'Admin User',
        email: 'admin@example.com',
        pass: adminPassword,
        role: 'admin',
      },
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values(usersToInsert)
      .execute();

    // Obtener IDs de los usuarios insertados
    const users: { id: string; email: string }[] = await queryRunner.manager.find(User, {
      select: ['id', 'email'],
    });

    const findUserId = (email: string) =>
      users.find((u) => u.email === email)?.id ?? null;

    const tasksToInsert = [
      {
        title: 'Comprar leche',
        description: 'Ir al supermercado y comprar leche semidesnatada',
        done: false,
        dueDate: '2025-08-10',
        ownerId: findUserId('alice@example.com'),
      },
      {
        title: 'Revisar CV',
        description: 'Actualizar el currículum con los últimos proyectos',
        done: true,
        dueDate: '2025-08-05',
        ownerId: findUserId('bob@example.com'),
      },
      {
        title: 'Planificar vacaciones',
        description: 'Buscar vuelos y hoteles para septiembre',
        done: false,
        dueDate: '2025-09-01',
        ownerId: findUserId('charlie@example.com'),
      },
    ];

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('tasks')
      .values(tasksToInsert)
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM tasks');
    await queryRunner.query('DELETE FROM users');
  }
}
