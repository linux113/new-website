/**
 * Storage abstraction contracts. The application depends only on
 * these types + getStorage() — never on provider internals.
 */

export interface PutObjectInput {
  key: string;
  body: Buffer;
  contentType: string;
}

export interface PutObjectResult {
  /** Provider identifier persisted on MediaAsset.storageProvider. */
  provider: string;
  key: string;
  /** Publicly reachable URL (CDN/bucket public URL or local path). */
  publicUrl: string;
}

export interface StorageProvider {
  readonly name: string;
  put(input: PutObjectInput): Promise<PutObjectResult>;
  delete(key: string): Promise<void>;
}
