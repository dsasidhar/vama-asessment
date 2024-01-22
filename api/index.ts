import Ajv, { JSONSchemaType } from 'ajv';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { uuid as uuidv4 } from 'uuidv4';

import { accountIdToSenderMapping, chatMessagesByMessageId } from './mockData';

const app = express();
const server = http.createServer(app);

// middlwares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});
app.use(express.json());
app.use(require('morgan')('dev'));

const io = new Server(server, {
  path: '/ws',
  cors: {
    origin: '*',
  },
});

interface SignInRequest {
  phone_number: string;
  country_code: string;
  verify_code: string;
  app_check_token: string;
}

type ValidationResponse =
  | {
      valid: true;
      signInRequest: SignInRequest;
    }
  | {
      valid: false;
      error: string;
    };

// In-memory data structures for messages and tokens
const messages: Record<string, any> = chatMessagesByMessageId;
const tokens: Record<string, string> = {};

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const validNumbers = ['+12816668888', '+12816668889'];
  return validNumbers.includes(phoneNumber);
};

const validateSchema = (body: any): ValidationResponse => {
  const schema: JSONSchemaType<SignInRequest> = {
    type: 'object',
    properties: {
      phone_number: { type: 'string' },
      country_code: { type: 'string' },
      verify_code: { type: 'string' },
      app_check_token: { type: 'string' },
      device_id: { type: 'string' },
    },
    required: [
      'phone_number',
      'country_code',
      'verify_code',
      'app_check_token',
    ],
    additionalProperties: false,
  };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(body);
  if (!valid) {
    console.log(validate.errors);
    return {
      valid: false,
      error:
        validate.errors?.[0]?.message || 'Invalid input, ajv validation failed',
    };
  }

  return {
    valid: true,
    signInRequest: body,
  };
};

// Sign-in API endpoint
app.post('/signin_sms', (req, res) => {
  if (!validatePhoneNumber(req.body.phone_number)) {
    res.status(401).json({
      id: uuidv4(),
      error: {
        message: 'Invalid Phone Number',
        code: 401,
      },
    });
    return;
  }
  // validate with schema
  const validationResponse = validateSchema(req.body);

  if (validationResponse.valid) {
    const token = uuidv4();
    const accountId = `account-id-${validationResponse.signInRequest.phone_number}`;
    tokens[token] = accountId;
    res.json({
      id: uuidv4(),
      data: {
        token,
        account_id: accountId,
        token_expires_at: 'some-expiration-time',
      },
    });
  } else {
    res.status(401).json({
      id: uuidv4(),
      error: {
        message: validationResponse.error,
        code: 401,
      },
    });
  }
});

// Socket.IO connection handler
io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);
  const queryTokens = socket.handshake.query.token;

  const token = Array.isArray(queryTokens)
    ? queryTokens.join('')
    : queryTokens || '';

  if (!tokens[token]) {
    socket.disconnect();
    return;
  }

  const accountId = tokens[token];

  // Join the channel
  socket.join('06c0206c-71b5-11ed-afa2-acde48001122');

  // Handle message creation
  const handleMessageCreate = (data, socket) => {
    const messageId = uuidv4();
    messages[messageId] = {
      id: messageId,
      channel_id: data.data.channel_id,
      sender_id: accountId,
      sender: accountIdToSenderMapping[accountId],
      text: data.data.text,
      timestamp: new Date().toISOString(),
    };
    socket
      .to('06c0206c-71b5-11ed-afa2-acde48001122')
      .emit('response', messages[messageId]);
  };

  const handleMessageList = async (data, socket) => {
    const channelMessages = Object.values(messages)
      .filter((message: any) => message.channel_id === data.data.channel_id)
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
    const pageMessages = channelMessages.slice(
      data.data.page_req.page * data.data.page_req.size,
      (data.data.page_req.page + 1) * data.data.page_req.size,
    );
    // artificial delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1000));
    socket.emit('response', {
      id: data.id,
      messages: pageMessages,
      page_res: {
        page: data.data.page_req.page,
        count: data.data.page_req.size,
        has_more: pageMessages.length === data.data.page_req.size,
      },
    });
  };

  socket.on('request', async (data) => {
    switch (data.method) {
      case 'create':
        console.log('handling message create', data);
        handleMessageCreate(data, socket);
        break;
      case 'list':
        console.log('handling message list', data);
        await handleMessageList(data, socket);
        break;
      default:
        console.log('Invalid method');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
    socket.leave('06c0206c-71b5-11ed-afa2-acde48001122');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
