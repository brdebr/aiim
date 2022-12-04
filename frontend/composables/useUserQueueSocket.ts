import { ImageObject } from '~~/types';
import { io, Socket } from 'socket.io-client'
import { apiWsBaseUrlDev } from '~~/constants';

type ImageGenerationEvent = {
  image: ImageObject;
  queuePosition?: number;
};

export const useUserQueueSocket = (
  callback: (generationEvent: ImageGenerationEvent) => void,
) => {
  let socket: Socket | undefined;

  const authStore = useAuthStore();
  const { userId } = storeToRefs(authStore);

  onMounted(() => {
    socket = io(apiWsBaseUrlDev, {
      transports: ['websocket'],
    });
  
    socket.on('connect', () => {
      console.log(`Connected to socket server`);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('image_finished', (generationEvent: ImageGenerationEvent) => {
      console.log(`Received image ${generationEvent.image.id} from socket server`);
      callback(generationEvent);
    });
  
    joinQueue();
  })

  const joinQueue = () => {
    console.log(`Joining queue for user: ${userId.value}`);
    socket?.emit('user_queue_enter', userId.value);
  }
  const leaveQueue = () => {
    console.log(`Leaving queue for user: ${userId.value}`);
    socket?.emit('user_queue_leave', userId.value);
  }

  onUnmounted(() => {
    leaveQueue();
    socket?.disconnect()
  })

  return {
    socket,
  }
};
