import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

import { ChannelID, webSocketUrl } from './apiConstants';
import { ChatHistoryItem } from './appState';

export class SocketManager {
  private socket: Socket;
  private chatHistoryUpdater?: (moreChatHistory: ChatHistoryItem[]) => void;
  private connectionStatusUpdater?: (newConnectionStatus: string) => void;
  private loadingStatusUpdater?: (newLoadingStatus: boolean) => void;
  private pendingListingRequests = new Set<string>();
  private serverHasMoreChatHistory = true;
  private constructor(token: string) {
    this.socket = io(`${webSocketUrl}`, {
      path: '/ws',
      query: {
        token,
      },
    });
  }
  private static instance: SocketManager;
  public static getInstance(token?: string): SocketManager {
    if (!SocketManager.instance) {
      if (!token) {
        throw new Error('SocketManager must be initialized with a token');
      }
      SocketManager.instance = new SocketManager(token);
    }
    return SocketManager.instance;
  }

  public connect(): SocketManager {
    this.socket.on('connect', () => {
      console.log('socket connected');
      this.serverHasMoreChatHistory = true;
      this.connectionStatusUpdater && this.connectionStatusUpdater('connected');
      this.onMessageList();
    });
    return this;
  }

  public disconnect(): void {
    this.socket.on('disconnect', () => {
      console.log('socket disconnected');
      this.socket.removeAllListeners();
    });
  }

  public sendMessage(message: string): void {
    const id = uuidv4();
    this.socket.emit('request', {
      id: id,
      service: 'message',
      method: 'create',
      data: {
        channel_id: ChannelID,
        text: message,
      },
    });
  }

  public fetchChatHistory(pageNo: number): void {
    if (this.serverHasMoreChatHistory === false) {
      return;
    }
    this.loadingStatusUpdater && this.loadingStatusUpdater(true);
    const id = uuidv4();
    this.socket.emit('request', {
      id: id,
      service: 'message',
      method: 'list',
      data: {
        channel_id: ChannelID,
        direction: 'newestFirst',
        page_req: {
          page: pageNo,
          size: 50,
        },
      },
    });
    this.pendingListingRequests.add(id);
  }
  // Recoil makes it very hard to update state outside of a React component.
  // This is a workaround to allow SocketManager to update the chat history
  public stateUpdaters(
    chatHistoryUpdater: (moreChatHistory: ChatHistoryItem[]) => void,
    connectionStatusUpdater: (newConnectionStatus: string) => void,
    loadingStatusUpdater: (newLoadingStatus: boolean) => void,
  ): void {
    this.chatHistoryUpdater = chatHistoryUpdater;
    this.connectionStatusUpdater = connectionStatusUpdater;
    this.loadingStatusUpdater = loadingStatusUpdater;
  }

  public onMessageList(): void {
    this.socket.on('response', (data) => {
      console.log('got response', data);
      if (this.pendingListingRequests.has(data.id)) {
        this.handleMessageListResponse(data);
        this.pendingListingRequests.delete(data.id);
        this.loadingStatusUpdater && this.loadingStatusUpdater(false);
        return;
      }
      // handle async event from server
      this.handleAsyncEventFromServer(data);
    });
  }

  private handleAsyncEventFromServer(data: any): void {
    if (!this.chatHistoryUpdater) {
      return;
    }
    console.log('got async event', data);
    this.chatHistoryUpdater([
      {
        id: data.id,
        sender: data.sender_id,
        message: data.text,
        timeStamp: data.timestamp,
      },
    ]);
  }

  private handleMessageListResponse(data: any): void {
    if (!this.chatHistoryUpdater) {
      console.log('cannot update');
      return;
    }
    console.log(
      'got message:list',
      data.messages[0]?.id,
      'to',
      data.messages[data.messages.length - 1]?.id,
    );
    this.chatHistoryUpdater(
      data.messages.map((message: any) => ({
        id: message.id,
        sender: message.sender_id,
        message: message.text,
        timeStamp: message.timestamp,
      })),
    );
    this.serverHasMoreChatHistory = data.page_res.has_more;
  }
}

export default SocketManager;
