import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { serverConfig } from '../serverConfig';

export const app = initializeApp(serverConfig.firebase);

export const database = getFirestore();
