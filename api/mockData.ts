import { addMinutes, subDays } from 'date-fns';

const startTime = subDays(new Date(), 2);

export const accountIdToSenderMapping = {
  'account-id-+12816668888': {
    id: 'account-id-+12816668888',
    first_name: 'Spongebob',
    last_name: 'Squarepants',
    username: 'spongebob-squarepants',
  },
  'account-id-+12816668889': {
    id: 'account-id-+12816668889',
    first_name: 'Mr.',
    last_name: 'Krabs',
    username: 'mr.-krabs',
  },
};

// Conversation between Spongebob and Mr. Krabs
export const chatMessages = [
  ...Array(10)
    .fill([
      'Hello Mr. Krabs!',
      'Hello Squarepants!',
      'How are you doing today?',
      'I am doing well, thank you for asking!',
      'I am glad to hear that!',
      'How is your day going?',
      'It is going great!',
      'How is Seattle?',
      'It is raining!',
      'Is it raining money?',
      'Unfortunately, no.',
      'Then I am not interested.',
      'Of course you are not.',
      'Ok Bye!',
    ])
    .map((set, index) => [
      `--------------------- ${index + 1}`,
      `message set: ${index + 1}`,
      ...set,
    ])
    .flat(),
].map((text, index) => {
  const phoneNumber = index % 2 === 0 ? '+12816668888' : '+12816668889';
  return {
    id: `message_${index}`,
    channel_id: '06c0206c-71b5-11ed-afa2-acde48001122',
    sender_id: `account-id-${phoneNumber}`,
    sender: accountIdToSenderMapping[`account-id-${phoneNumber}`],
    text,
    timestamp: addMinutes(startTime, index * 10),
  };
});

export const chatMessagesByMessageId = chatMessages.reduce((acc, message) => {
  acc[message.id] = message;
  return acc;
}, {});
