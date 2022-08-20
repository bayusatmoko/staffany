import { Server } from '@hapi/hapi';
import * as weekController from './weekController';
import { createWeekDto } from '../../../shared/dtos';

export default function (server: Server, basePath: string) {
  server.route({
    method: "POST",
    path: basePath,
    handler: weekController.create,
    options: {
      description: 'Create week',
      notes: 'Create week',
      tags: ['api', 'week'],
      validate: {
        payload: createWeekDto
      },
    }
  });
}