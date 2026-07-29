import { supabase } from "../config/supabase.js";

/**
 * Extracts a strict Bearer token from the Authorization header.
 */
const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    return null;
  }

  const match = authorizationHeader.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return null;
  }

  return match[1];
};

/**
 * Reusable Supabase JWT authentication middleware.
 */
export const authenticate = async (req, res, next) => {
  try {
    const accessToken = extractBearerToken(req.headers.authorization);

    if (!accessToken) {
      return res.status(401).json({
        error: "Access token required"
      });
    }

    const {
      data: { user },
      error
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({
        error: "Invalid or expired token"
      });
    }

    req.user = user;
    req.accessToken = accessToken;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
};

/**
 * Stretch authorization middleware.
 *
 * This assumes app_metadata.role has been set securely by an administrator.
 */
export const requireAdmin = (req, res, next) => {
  const role = req.user?.app_metadata?.role;

  if (role !== "admin") {
    return res.status(403).json({
      error: "Admin access required"
    });
  }

  return next();
};