'use client';

/**
 * @fileOverview Firebase Client SDK Entry Point.
 * Re-exports initialization logic and custom hooks for application-wide use.
 */

export * from './init';
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
