
import { SyncMessage } from '../types';

const CHANNEL_NAME = 'math_bingo_sync';

export class SyncService {
  private channel: BroadcastChannel;
  private onMessageCallback: (msg: SyncMessage) => void;

  constructor(onMessage: (msg: SyncMessage) => void) {
    this.channel = new BroadcastChannel(CHANNEL_NAME);
    this.onMessageCallback = onMessage;
    this.channel.onmessage = (event) => {
      this.onMessageCallback(event.data);
    };
  }

  sendMessage(message: SyncMessage) {
    this.channel.postMessage(message);
  }

  close() {
    this.channel.close();
  }
}
