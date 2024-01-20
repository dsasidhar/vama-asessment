import { atom } from 'recoil';

export const userPhoneNumber$ = atom({
  key: 'userPhoneNumber',
  default: '12816668889',
});

export const userFirstName$ = atom({
  key: 'userFirstName',
  default: '',
});

export const userLastName$ = atom({
  key: 'userLastName',
  default: '',
});

export const mockContactList = [
  {
    id: '0001',
    firstName: 'John',
    lastName: 'Doe',
    userName: 'JohnDoe',
    avatar: '',
  },
  {
    id: '0002',
    firstName: 'Iron',
    lastName: 'Man',
    userName: 'JohnDoe',
    avatar: '',
  },
  {
    id: '0003',
    firstName: 'Mr',
    lastName: 'Hulk',
    userName: 'JohnDoe',
    avatar: '',
  },
  {
    id: '0004',
    firstName: 'Scarlet',
    lastName: 'Witch',
    userName: 'JohnDoe',
    avatar: '',
  },
];

export const contactList$ = atom({
  key: 'contactList',
  default: mockContactList,
});

export const selectedContactIndex$ = atom({
  key: 'selectedContactIndex',
  default: 1,
});

const mockChatHistory = [
  {
    id: 1234,
    sender: '0001',
    receiver: '0002',
    message: 'Hello Iron man',
    timeStamp: '2021-01-01 00:10:00',
  },
  {
    id: 1235,
    sender: '0002',
    receiver: '0001',
    message: 'Hello John Doe',
    timeStamp: '2021-01-01 00:15:01',
  },
  {
    id: 1236,
    sender: '0001',
    receiver: '0002',
    message: 'How are you?',
    timeStamp: '2021-01-01 00:20:00',
  },
  {
    id: 1237,
    sender: '0002',
    receiver: '0001',
    message: 'I am fine, thank you.',
    timeStamp: '2021-01-01 00:25:00',
  },
  {
    id: 1238,
    sender: '0001',
    receiver: '0002',
    message: 'How about you?',
    timeStamp: '2021-01-01 00:30:00',
  },
  {
    id: 1239,
    sender: '0002',
    receiver: '0001',
    message: 'I am fine too.',
    timeStamp: '2021-01-01 00:35:00',
  },
  {
    id: 1240,
    sender: '0001',
    receiver: '0002',
    message: 'Good to hear that.',
    timeStamp: '2021-01-01 00:40:00',
  },
  {
    id: 1241,
    sender: '0002',
    receiver: '0001',
    message: 'Good to hear that too.',
    timeStamp: '2021-01-01 00:45:00',
  },
  {
    id: 1242,
    sender: '0001',
    receiver: '0002',
    message: 'Goodbye.',
    timeStamp: '2021-01-01 00:50:00',
  },
  {
    id: 1243,
    sender: '0002',
    receiver: '0001',
    message: 'Goodbye too.',
    timeStamp: '2021-01-01 00:55:00',
  },
  {
    id: 1244,
    sender: '0001',
    receiver: '0002',
    message: 'See you.',
    timeStamp: '2021-01-01 01:00:00',
  },
  {
    id: 1245,
    sender: '0002',
    receiver: '0001',
    message: 'See you too.',
    timeStamp: '2021-01-01 01:05:00',
  },
  {
    id: 1246,
    sender: '0001',
    receiver: '0002',
    message: 'Bye.',
    timeStamp: '2021-01-01 01:10:00',
  },
  {
    id: 1247,
    sender: '0002',
    receiver: '0001',
    message: 'Bye too.',
    timeStamp: '2021-01-01 01:15:00',
  },
  {
    id: 1248,
    sender: '0001',
    receiver: '0002',
    message: 'Good night.',
    timeStamp: '2021-01-01 01:20:00',
  },
  {
    id: 1249,
    sender: '0002',
    receiver: '0001',
    message: 'Good night too.',
    timeStamp: '2021-01-01 01:25:00',
  },
  {
    id: 1250,
    sender: '0001',
    receiver: '0002',
    message: 'Good morning.',
    timeStamp: '2021-01-01 01:30:00',
  },
  {
    id: 1251,
    sender: '0002',
    receiver: '0001',
    message: 'Good morning too.',
    timeStamp: '2021-01-01 01:35:00',
  },
  {
    id: 1252,
    sender: '0001',
    receiver: '0002',
    message: 'Good afternoon.',
    timeStamp: '2021-01-01 01:40:00',
  },
  {
    id: 1253,
    sender: '0002',
    receiver: '0001',
    message: 'Good afternoon too.',
    timeStamp: '2021-01-01 01:45:00',
  },
];

export const activeChatHistory$ = atom({
  key: 'activeChatHistory',
  default: mockChatHistory,
});
