import 'dotenv/config';
import { Agent, AgentInputItem, run, StreamedRunResult } from '@openai/agents';
import { orchestrator } from './agents/orchestrator';
import readline from 'node:readline/promises';
import crypto from 'crypto';
import express from 'express';
import session from 'express-session';
import { google } from 'googleapis';
import axios from 'axios';

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
const trustedTokens = new Set<string>();
const arrayOfTrustedUsers = (process.env.TRUSTED_USER_EMAILS || '').split(',').map(s => s.trim());
const trustedUsers = new Set<string>(arrayOfTrustedUsers);

declare module 'express-session' {
  export interface SessionData {
    accessToken: string;
    state: string;
  }
}

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || 'gikkity gakkity goo',
  resave: false,
  saveUninitialized: true
}));

app.get('/api/google/login', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    include_granted_scopes: true,
    scope: ['https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'],
    state
  });
  req.session.state = state;
  res.redirect(authUrl)
})

app.get('/api/oauth/google/callback', async (req, res) => {
  const { code, state} = req.query;
  console.log('Authorization code received');

  try {
    if (!code || typeof code !== 'string') {
      return res.status(400).send('Invalid code received');
    }

    if (state !== req.session.state) {
      return res.status(403).send('Invalid state received');
    }

    let { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      return res.status(400).send('No access token received');
    }

    // for now a session will just last as long as the first token is valid
    trustedTokens.add(tokens.access_token);

    req.session.accessToken = tokens.access_token;
    res.redirect('/user');
  } catch (err) {
    res.send('Error validating access token');
  }
})

app.get('/api/session', async (req, res) => {
  const accessToken = req.session.accessToken;
  if (!accessToken) {
    return res.status(401).send('No access token found, please log in.');
  }

  try {
    if (!trustedTokens.has(accessToken)) {
      delete req.session.accessToken;
      return res.status(401).send('Invalid access token, please log in.');
    }
    
    const { data: { picture, email, name } } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const isTrustedUser = email && trustedUsers.has(email);

    res.json({ isAuth: true, isTrustedUser: isTrustedUser, userProfile: { picture, name } });
  } catch (error) {
    console.error('Error verifying access token:', error);
    delete req.session.accessToken;
    res.status(401).send('Error verifying access token, please log in.');
  }
});

app.get('/api/logout', async (req, res) => {
  const accessToken = req.session.accessToken;
  
  if (!accessToken) {
    res.redirect('/');
    return;
  }

  await oauth2Client.revokeToken(accessToken);
  
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

app.get('/api/health', (req, res) => {
  res.send('Server is healthy');
});

app.use(express.static('frontend/dist'));

// other routes than api should serve the frontend
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile('index.html', { root: 'frontend/dist' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// const INITIAL_PROMPT = `Hello, I am MollieGPT. I can help you with information about customers and their subscriptions. How can I assist you today? \n\n`;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// async function main(){
//   let result: StreamedRunResult<any, Agent<any, any>> | undefined;
  
//   let userquery = await rl.question(INITIAL_PROMPT);
//   const initialInput: AgentInputItem[] = [{role: 'user', content: userquery}];
//   let session: { inputs: AgentInputItem[]} = { inputs: initialInput };

//   while (true) {
//     const inputs = session.inputs;
    
//     result = await run(
//         orchestrator,
//         inputs,
//         { stream: true }
//     );

//     result.toTextStream({ compatibleWithNodeStreams: true }).pipe(process.stdout);
//     await result.completed;

//     process.stdout.write('\n\n\n');
//     userquery = await rl.question('');

//     session = {
//       inputs: [...result.history, {role: 'user', content: userquery}]
//     }
//   }
// }

// main().catch((error) => {
//   console.error('Error in running the main function', error);
//   process.exit(1);
// });