// import { SiweMessage, generateNonce } from 'siwe';

// export class AuthService {
//   async generate(): Promise<string> {
//     return generateNonce();
//   }

//   async verify(
//     message: string,
//     nonce: string,
//   ): Promise<{ messages; expiryTime }> {
//     let siwe = new SiweMessage(message);
//     const { data: messages } = await siwe.verify({
//       signature: message,
//       nonce: nonce,
//     });
//     return {
//       messages,
//       expiryTime: new Date(messages.expirationTime),
//     };
//   }
// }
