import { ImageObject } from '@prisma/client';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { TextToImageGenerationJobType } from './image-generation.processor';

export type ImageGenerationEvent = {
  image: ImageObject;
  user: string;
  queuePosition?: number;
};

@WebSocketGateway({
  namespace: '/api/',
  cors: { origin: '*' },
})
export class ImageGenerationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectQueue('generation')
    private generationQueue: Queue<TextToImageGenerationJobType>,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ImageGenerationGateway.name);

  afterInit(server: Server) {
    this.logger.log('Websocket initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: '${client.id}'`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: '${client.id}'`);
  }

  @SubscribeMessage('user_queue_enter')
  handleJoinRoom(client: Socket, userId: string) {
    this.logger.log(`Client '${client.id}' joined room for userID '${userId}'`);
    client.join(`user_${userId}`);
  }

  @SubscribeMessage('user_queue_leave')
  handleRoomLeave(client: Socket, userId: string) {
    this.logger.log(`Client '${client.id}' left room for userID '${userId}'`);
    client.leave(`user_${userId}`);
  }

  @OnEvent('image-generated')
  async sendImageObjectGenerated(payload: ImageGenerationEvent) {
    this.logger.log(
      `Sending image '${payload.image.id}' to user '${payload.user}' via socket`,
    );
    payload.queuePosition = (await this.generationQueue.getJobCounts()).waiting;
    this.server.to(`user_${payload.user}`).emit('image_finished', {
      image: payload.image,
      queuePosition: payload.queuePosition,
    });
  }
}
