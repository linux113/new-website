import "server-only";
import { createHash, createHmac } from "node:crypto";
import type { PutObjectInput, PutObjectResult, StorageProvider } from "./types";

/**
 * Cloudflare R2 provider (S3-compatible) via AWS Signature V4 —
 * implemented directly over fetch, no SDK dependency (the two
 * operations we need don't justify ~3 MB of @aws-sdk/client-s3).
 *
 * Credentials are read server-side only; this module can never be
 * imported by client components ("server-only").
 */

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicBaseUrl: string;
}

function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

export class R2StorageProvider implements StorageProvider {
  readonly name = "r2";
  private readonly config: R2Config;
  private readonly host: string;

  constructor(config: R2Config) {
    this.config = config;
    this.host = `${config.accountId}.r2.cloudflarestorage.com`;
  }

  private async signedFetch(
    method: "PUT" | "DELETE",
    key: string,
    body?: Buffer,
    contentType?: string,
  ): Promise<Response> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const dateStamp = amzDate.slice(0, 8);
    const region = "auto";
    const service = "s3";

    const canonicalUri = `/${this.config.bucket}/${key
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
    const payloadHash = sha256Hex(body ?? "");

    const headers: Record<string, string> = {
      host: this.host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    };
    if (contentType) headers["content-type"] = contentType;

    const signedHeaderNames = Object.keys(headers).sort();
    const canonicalHeaders = signedHeaderNames
      .map((name) => `${name}:${headers[name].trim()}\n`)
      .join("");
    const signedHeaders = signedHeaderNames.join(";");

    const canonicalRequest = [
      method,
      canonicalUri,
      "", // query string
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      sha256Hex(canonicalRequest),
    ].join("\n");

    const kDate = hmac(`AWS4${this.config.secretAccessKey}`, dateStamp);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, "aws4_request");
    const signature = createHmac("sha256", kSigning)
      .update(stringToSign)
      .digest("hex");

    const authorization = `AWS4-HMAC-SHA256 Credential=${this.config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return fetch(`https://${this.host}${canonicalUri}`, {
      method,
      headers: { ...headers, authorization },
      body: body as BodyInit | undefined,
    });
  }

  async put(input: PutObjectInput): Promise<PutObjectResult> {
    const response = await this.signedFetch("PUT", input.key, input.body, input.contentType);
    if (!response.ok) {
      throw new Error(`R2 PUT failed: ${response.status}`);
    }
    return {
      provider: this.name,
      key: input.key,
      publicUrl: `${this.config.publicBaseUrl.replace(/\/$/, "")}/${input.key}`,
    };
  }

  async delete(key: string): Promise<void> {
    const response = await this.signedFetch("DELETE", key);
    if (!response.ok && response.status !== 404) {
      throw new Error(`R2 DELETE failed: ${response.status}`);
    }
  }
}

export function r2FromEnv(): R2StorageProvider | null {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL,
  } = process.env;
  if (
    !R2_ACCOUNT_ID ||
    !R2_ACCESS_KEY_ID ||
    !R2_SECRET_ACCESS_KEY ||
    !R2_BUCKET_NAME ||
    !R2_PUBLIC_URL
  ) {
    return null;
  }
  return new R2StorageProvider({
    accountId: R2_ACCOUNT_ID,
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    bucket: R2_BUCKET_NAME,
    publicBaseUrl: R2_PUBLIC_URL,
  });
}
