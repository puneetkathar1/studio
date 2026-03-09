import 'server-only';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';
import { existsSync } from 'node:fs';

/**
 * @fileOverview Hardened Admin Node v6.0.
 * Ensures server-side actions can authenticate by using explicit project configuration.
 */

function getServiceAccountFromEnv() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE;
  if (json) {
    try {
      const trimmed = json.trim();
      const normalized =
        (trimmed.startsWith("`") && trimmed.endsWith("`")) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
          ? trimmed.slice(1, -1)
          : trimmed;
      return JSON.parse(normalized);
    } catch {
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON/FIREBASE JSON');
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
    console.log(
      JSON.stringify({
        scope: 'firebase.admin',
        step: 'init',
        authMode: 'service_account_env',
        projectId: serviceAccount.project_id || firebaseConfig.projectId,
        ts: new Date().toISOString(),
      })
    );
    return initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id || firebaseConfig.projectId,
    });
  }

  const adcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (adcPath && !existsSync(adcPath)) {
    throw new Error(
      `GOOGLE_APPLICATION_CREDENTIALS points to a missing file: ${adcPath}. ` +
      `Use FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT_JSON) for env-only auth.`
    );
  }

  if (!adcPath) {
    throw new Error(
      `Firebase Admin credentials are missing. ` +
      `Set FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env ` +
      `or provide FIREBASE_SERVICE_ACCOUNT_JSON.`
    );
  }

  console.log(
    JSON.stringify({
      scope: 'firebase.admin',
      step: 'init',
      authMode: 'google_application_credentials_file',
      adcPath,
      projectId: process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId,
      ts: new Date().toISOString(),
    })
  );

  return initializeApp({ projectId: process.env.GOOGLE_CLOUD_PROJECT || firebaseConfig.projectId });
}

let appInstance: App | null = null;
let dbInstance: ReturnType<typeof getFirestore> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  if (!appInstance) appInstance = getAdminApp();
  dbInstance = getFirestore(appInstance);
  return dbInstance;
}
