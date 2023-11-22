import { createWriteStream } from "fs";
import { ValidationError } from "express-json-validator-middleware";
import { tmpdir } from "os";
import { join } from "path";
import busboy from "busboy";
import { functions, admin } from "../../utils/firebase";
import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";
import { File, CustomRequest } from "../../types/requests";

const extractFiles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {

  const multipart =
    req.method === "POST" &&
    req.headers["content-type"] &&
    req.headers["content-type"].startsWith("multipart/form-data");
  if (!multipart) return next();
  //
  const busboyInstance = busboy({ headers: req.headers });
  const incomingFields: { [key: string]: string } = {};
  const incomingFiles: { [key: string]: File[] } = {};
  const writes: Promise<any>[] = [];

  // Process fields
  busboyInstance.on("field", (name, value) => {
    try {
      // This will keep a field created like so form.append('product', JSON.stringify(product)) intact
      incomingFields[name] = JSON.parse(value);
    } catch (e) {
      // Numbers will still be strings here (i.e 1 will be '1')
      incomingFields[name] = value;
    }
  });

  // Process files
  busboyInstance.on("file", (fieldname, file, info) => {
    const { filename, encoding, mimeType } = info;
    const path = join(tmpdir(), `${new Date().toISOString()}-${filename}`);
    // NOTE: Multiple files could have same fieldname (which is y I'm using arrays here)
    incomingFiles[fieldname] = incomingFiles[fieldname] || [];
    incomingFiles[fieldname].push({
      path: path,
      encoding: encoding,
      mimeType: mimeType,
      filename: filename,
      file: file,
    } as File);
    //
    const writeStream = createWriteStream(path);
    //
    writes.push(
      new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      })
    );
    //
    file.pipe(writeStream);
  });
  busboyInstance.on("error", (e) => {
    console.log("Execution started, error Block");
    console.log(e);
    console.log("Execution Ended, error Block");
  });
  //
  busboyInstance.on("close", async () => {
    await Promise.all(writes);
    req.files = incomingFiles;
    req.body = incomingFields;
    next();
  });
  // req.pipe(busboyInstance);
  busboyInstance.end(req.body);
};

const validateFirebaseIdToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const excludedRoutes: string[] = ["/stripe/webhook"];

  if (excludedRoutes.includes(req.path)) {
    // Exclude the route from authentication
    next();
    return;
  }

  functions.logger.log("Check if request is authorized with Firebase ID token");

  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !(req.cookies && req.cookies.__session)
  ) {
    functions.logger.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header.",
      "Make sure you authorize your request by providing the following HTTP header:",
      "Authorization: Bearer <Firebase ID Token>",
      'or by passing a "__session" cookie.'
    );
    res.status(403).send("Unauthorized");
    return;
  }

  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    functions.logger.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    functions.logger.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send("Unauthorized");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    functions.logger.log("ID Token correctly decoded", decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    functions.logger.error("Error while verifying Firebase ID token:", error);
    res.status(403).json({ error: "Unauthorized User" });
    return;
  }
};

const validationErrorMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (response.headersSent) {
    return next(error);
  }

  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }

  response.status(400).json({
    errors: error.validationErrors,
  });

  next();
};

export { validateFirebaseIdToken, validationErrorMiddleware, extractFiles };
