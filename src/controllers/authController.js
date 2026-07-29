import {
  supabase,
  createAuthenticatedSupabaseClient
} from "../config/supabase.js";

/**
 * Basic email validation.
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * POST /auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { email: rawEmail, password: rawPassword } = req.body ?? {};

        const email =
        typeof rawEmail === "string"
            ? rawEmail.trim().toLowerCase()
            : "";

        const password =
        typeof rawPassword === "string"
            ? rawPassword
            : "";

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "A valid email address is required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must contain at least 6 characters"
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(201).json({
      message: "User account created successfully",
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            created_at: data.user.created_at
          }
        : null
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /auth/login
 */
export const login = async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return res.status(401).json({
        error: "Invalid login credentials"
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token_type: "Bearer",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /auth/logout
 *
 * The authenticated token is provided by authMiddleware.
 */
export const logout = async (req, res, next) => {
  try {
    const authenticatedClient = createAuthenticatedSupabaseClient(
      req.accessToken
    );

    const { error } = await authenticatedClient.auth.signOut({
      scope: "global"
    });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /auth/refresh
 *
 * Optional stretch requirement.
 */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken =
      typeof req.body.refresh_token === "string"
        ? req.body.refresh_token.trim()
        : "";

    if (!refreshToken) {
      return res.status(400).json({
        error: "Refresh token is required"
      });
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error || !data.session) {
      return res.status(401).json({
        error: "Invalid or expired refresh token"
      });
    }

    return res.status(200).json({
      message: "Access token refreshed successfully",
      token_type: "Bearer",
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at
    });
  } catch (error) {
    return next(error);
  }
};