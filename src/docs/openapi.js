export const openApiDocument = {
  openapi: "3.0.3",

  info: {
    title: "Supabase Authentication API",
    version: "1.0.0",
    description:
      "Secure Node.js and Express API using Supabase authentication, JWT verification and reusable middleware."
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],

  tags: [
    {
      name: "Authentication",
      description: "Signup, login, logout and token refresh"
    },
    {
      name: "Public",
      description: "Routes that do not require authentication"
    },
    {
      name: "Protected",
      description: "Routes requiring a valid Supabase access token"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Enter the access token returned by POST /auth/login"
      }
    },

    schemas: {
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "test@example.com"
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "password123"
          }
        }
      },

      RefreshToken: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: {
            type: "string",
            example: "your-refresh-token"
          }
        }
      },

      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid"
          },
          email: {
            type: "string",
            format: "email"
          },
          created_at: {
            type: "string",
            format: "date-time"
          }
        }
      },

      LoginResponse: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Login successful"
          },
          token_type: {
            type: "string",
            example: "Bearer"
          },
          access_token: {
            type: "string",
            example: "eyJhbGciOi..."
          },
          refresh_token: {
            type: "string"
          },
          expires_in: {
            type: "integer",
            example: 3600
          },
          expires_at: {
            type: "integer"
          },
          user: {
            $ref: "#/components/schemas/User"
          }
        }
      },

      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Invalid or expired token"
          }
        }
      }
    }
  },

  paths: {
    "/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "Create a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Credentials"
              }
            }
          }
        },
        responses: {
          201: {
            description: "User created successfully"
          },
          400: {
            description: "Missing or invalid input",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },

    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate a user and return tokens",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Credentials"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse"
                }
              }
            }
          },
          400: {
            description: "Missing email or password"
          },
          401: {
            description: "Invalid login credentials"
          },
          429: {
            description: "Too many failed login attempts"
          }
        }
      }
    },

    "/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Log out the authenticated user",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          204: {
            description: "Logout successful"
          },
          401: {
            description: "Missing, invalid or expired token"
          }
        }
      }
    },

    "/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Exchange a refresh token for a new access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshToken"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Token refreshed successfully"
          },
          400: {
            description: "Refresh token missing"
          },
          401: {
            description: "Invalid or expired refresh token"
          }
        }
      }
    },

    "/public/info": {
      get: {
        tags: ["Public"],
        summary: "Read publicly available information",
        responses: {
          200: {
            description: "Public information returned successfully",
            content: {
              "application/json": {
                example: {
                  message: "Welcome stranger! This info is public."
                }
              }
            }
          }
        }
      }
    },

    "/protected/profile": {
      get: {
        tags: ["Protected"],
        summary: "Read the authenticated user's profile",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "Profile returned successfully"
          },
          401: {
            description: "Missing, invalid or expired token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error"
                }
              }
            }
          }
        }
      }
    },

    "/protected/dashboard": {
      get: {
        tags: ["Protected"],
        summary: "Open the authenticated user's dashboard",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "Dashboard returned successfully"
          },
          401: {
            description: "Missing, invalid or expired token"
          }
        }
      }
    },

    "/protected/admin": {
      get: {
        tags: ["Protected"],
        summary: "Open the administrator-only endpoint",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "Admin route accessed successfully"
          },
          401: {
            description: "Authentication required"
          },
          403: {
            description: "Authenticated user is not an administrator"
          }
        }
      }
    }
  }
};