import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(422).json({ error: 'Validation failed', details: err.flatten() });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error' });
}
