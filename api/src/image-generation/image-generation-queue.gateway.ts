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
import {
  ProgressResponse,
  TextToImageGenerationJobType,
} from './image-generation.processor';
import { Text2ImageDto } from './dto/generateDto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/auth.service';

export type ImageGenerationEvent = {
  image: ImageObject;
  user: string;
  queuePosition?: number;
};

export type ImageOnQueueEvent = {
  params: Text2ImageDto;
  user: string;
};

export type ImageGenerationProgressEvent = {
  response: ProgressResponse;
  user: string;
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
    private jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ImageGenerationGateway.name);

  afterInit() {
    this.logger.log('Websocket initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const tokenFromHandshake = client.handshake?.auth?.token;
      const userJwtDecoded =
        this.jwtService.verify<JwtPayload>(tokenFromHandshake);

      this.logger.log(
        `User '${userJwtDecoded.id}' connected to WS as '${client.id}'`,
      );

      client.join(`user_${userJwtDecoded.id}`);
      return !!userJwtDecoded;
    } catch (error) {
      this.logger.error(`Client '${client.id}' failed to connect: bad auth`);
      client.disconnect(true);
      return false;
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const tokenFromHandshake = client.handshake?.auth?.token;
      const jwtDecoded = this.jwtService.verify<JwtPayload>(tokenFromHandshake);
      this.logger.log(
        `User '${jwtDecoded.id}' disconnected from WS, was client '${client.id}'`,
      );
    } catch (error) {
      this.logger.error(`Client '${client.id}' failed to disconnect: bad auth`);
    }
  }

  // Server Emmited Event handlers

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

  @OnEvent('image-on-queue')
  async sendImageOnQueue(payload: ImageGenerationEvent) {
    payload.queuePosition = (await this.generationQueue.getJobCounts()).waiting;
    this.server.to(`user_${payload.user}`).emit('image_on_queue', {
      image: payload.image,
      queuePosition: payload.queuePosition,
    });
  }

  @OnEvent('image-progress')
  async sendImageProgress(payload: ImageGenerationProgressEvent) {
    this.server
      .to(`user_${payload.user}`)
      .emit('image_on_progress', payload.response);
  }
}
