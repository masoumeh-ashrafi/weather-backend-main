import { config } from '../config/index.js';
import { AppError } from '../utils/AppError.js';

/**
 * Rejects requests whose Origin/Referer doesn't match the allowed frontend.
 *
 * This is NOT real authentication — it's a courtesy check. A determined
 * caller can spoof these headers with curl. It does stop:
 *   - browsers hitting the URL directly (no Origin header is sent for a
 *     plain address-bar GET, so those are rejected too, see allowNoOrigin)
 *   - most bots/scanners that don't bother setting Origin/Referer
 *   - accidental/casual poking around
 *
 * For real protection you'd need actual auth (API keys per client, signed
 * requests, or user login), which only makes sense once there's a server
 * session or account system to issue credentials to.
 */
export function originGuard(req, res, next) {
  const origin = req.get('origin') || req.get('referer');

  if (!origin) {
    return next(new AppError('Forbidden', 403));
  }

  const allowed = config.clientOrigin;
  const isAllowed = allowed === '*' || origin.startsWith(allowed);

  if (!isAllowed) {
    return next(new AppError('Forbidden', 403));
  }

  next();
}
