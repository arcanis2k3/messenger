import * as sdk from 'matrix-js-sdk';

const MATRIX_HOMESERVER_URL = 'https://matrix.zmodelz.com';

export const createMatrixClient = (accessToken: string, userId: string) => {
  const client = sdk.createClient({
    baseUrl: MATRIX_HOMESERVER_URL,
    accessToken,
    userId,
  });
  return client;
};

export const createMatrixRoom = async (client: any, name: string, topic: string, isPublic: boolean) => {
  const { room_id } = await client.createRoom({
    preset: isPublic ? 'public_chat' : 'private_chat',
    name,
    topic,
  });
  return room_id;
};

export const sendMessageToMatrixRoom = async (client: any, roomId: string, message: string) => {
  await client.sendEvent(
    roomId,
    'm.room.message',
    {
      body: message,
      msgtype: 'm.text',
    },
    ''
  );
};
