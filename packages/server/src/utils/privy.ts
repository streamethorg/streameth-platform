import { PrivyClient } from '@privy-io/server-auth';
import { config } from '@config';
const { appId, appSecret } = config.privy;
const privy = new PrivyClient(appId, appSecret);

export default privy;
