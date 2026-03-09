import 'server-only';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

/**
 * @fileOverview Hardened Admin Node v6.0.
 * Ensures server-side actions can authenticate by using explicit project configuration.
 */

function getServiceAccountFromEnv() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    try {
      return JSON.parse(json);
    } catch {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON');
    }
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    };
  }

  return null;
}

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const serviceAccount = getServiceAccountFromEnv();
  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id || firebaseConfig.projectId,
    });
  }

  // Fallback to ADC if available.
  return initializeApp({ projectId: firebaseConfig.projectId });
}

let appInstance: App | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  if (!appInstance) appInstance = getAdminApp();
  dbInstance = getFirestore(appInstance);
  return dbInstance;
}
