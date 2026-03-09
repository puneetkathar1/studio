'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useUser } from '@/firebase/provider';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * 
 * This hook waits for the Firebase Authentication state to resolve before initiating the subscription.
 * This prevents race conditions where requests are sent before the user's identity is verified by security rules.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const { isUserLoading, user } = useUser();

  useEffect(() => {
    // 1. AUTH SYNCHRONIZATION:
    // Do not initiate database listeners until the auth handshake is complete.
    if (isUserLoading) {
      setIsLoading(true);
      return;
    }

    // 2. TARGET VALIDATION:
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 3. DATABASE SUBSCRIPTION:
    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = snapshot.docs.map(doc => ({ 
          ...(doc.data() as T), 
          id: doc.id 
        }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      async (serverError: FirestoreError) => {
        // PERMISSION ERROR HANDLING:
        // Identify path context for debugging.
        const path: string =
          memoizedTargetRefOrQuery.type === 'collection'
            ? (memoizedTargetRefOrQuery as CollectionReference).path
            : (memoizedTargetRefOrQuery as any)._query?.path?.canonicalString() || 'unknown';
        console.error("Firestore error:", serverError);
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // Global propagation for the dev overlay
        errorEmitter.emit('permission-error', contextualError);
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery, isUserLoading, user?.uid]); 

  // MEMOIZATION CHECK:
  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error('Firestore target was not properly memoized using useMemoFirebase. This can lead to infinite render loops.');
  }
  
  return { data, isLoading, error };
}
