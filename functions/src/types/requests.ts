import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { Readable } from "stream";

interface File {
  path: string;
  filename: string;
  mimeType: string;
  encoding: string;
  file: Readable;
}

interface CustomRequest extends Request {
  files?: any;
  user?: DecodedIdToken;
}

export { CustomRequest, File };