import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getConversations } from '../api';

jest.mock('firebase/auth', () => ({
  getAuth: () => ({
    currentUser: {
      getIdToken: () => Promise.resolve('test-token'),
    },
  }),
}));

describe('api', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('getConversations returns data', async () => {
    const data = { conversations: [{ id: 1, name: 'Test' }] };
    mock.onGet('https://chat.zmodelz.com/messenger/conversations').reply(200, data);

    const result = await getConversations();

    expect(result).toEqual(data);
  });
});
