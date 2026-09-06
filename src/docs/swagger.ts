import swaggerUi from "swagger-ui-express";
import type { Application } from "express";

const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "BloodLink API",
    version: "1.0.0",
    description:
      "API documentation for BloodLink — Blood Donation & Emergency Assistance Platform",
  },

  servers: [
    {
      url: "https://blood-donation-and-emergency-platfo.vercel.app",
      description: "Production Server",
    },
    {
      url: "http://localhost:5000",
      description: "Local Server",
    },
  ],

  tags: [
    {
      name: "Auth",
      description: "Authentication APIs",
    },
    {
      name: "User",
      description: "User profile management APIs",
    },
    {
      name: "Blood Request",
      description: "Blood request management APIs",
    },
    {
      name: "Donor",
      description: "Donor management APIs",
    },
    {
      name: "Donation",
      description: "Blood donation APIs",
    },
    {
      name: "Payment",
      description: "Payment and bKash APIs",
    },
    {
      name: "Admin",
      description: "Admin management APIs",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  paths: {
    // =========================
    // AUTH
    // =========================

    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Create a new BloodLink user account.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],

                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "Rahima Begum",
                  },

                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com",
                  },

                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    example: "Password@123",
                    description:
                      "Must contain uppercase, lowercase, number and special character.",
                  },

                  phone: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678",
                  },

                  location: {
                    type: "string",
                    example: "Sylhet, Bangladesh",
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "User registered successfully",
          },

          "400": {
            description: "Validation error",
          },
        },
      },
    },

    "/api/v1/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email address",
        description: "Verify user's email address using a 6-digit OTP.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["email", "otp"],

                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com",
                  },

                  otp: {
                    type: "string",
                    minLength: 6,
                    maxLength: 6,
                    pattern: "^[0-9]{6}$",
                    example: "123456",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Email verified successfully",
          },

          "400": {
            description: "Invalid or expired OTP",
          },
        },
      },
    },

    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description: "Login using email and password.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["email", "password"],

                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com",
                  },

                  password: {
                    type: "string",
                    format: "password",
                    example: "Password@123",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Login successful",
          },

          "401": {
            description: "Invalid credentials",
          },
        },
      },
    },

    "/api/v1/auth/google": {
      post: {
        tags: ["Auth"],
        summary: "Login with Google",
        description:
          "Login or register a user using Google OAuth credential.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["credential"],

                properties: {
                  credential: {
                    type: "string",
                    minLength: 1,
                    example: "google-id-token",
                    description:
                      "Google Identity Services credential / ID token.",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Google login successful",
          },

          "401": {
            description: "Invalid Google credential",
          },
        },
      },
    },

    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description:
          "Generate a new access token using the refresh token.",

        responses: {
          "200": {
            description: "Access token refreshed successfully",
          },

          "401": {
            description: "Invalid or expired refresh token",
          },
        },
      },
    },

    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Forgot password",
        description:
          "Send a password reset OTP to the user's email.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["email"],

                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Password reset OTP sent successfully",
          },

          "404": {
            description: "User not found",
          },

          "400": {
            description: "Validation error",
          },
        },
      },
    },

    "/api/v1/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description:
          "Reset user password using a 6-digit OTP.",

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["email", "otp", "newPassword"],

                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com",
                  },

                  otp: {
                    type: "string",
                    minLength: 6,
                    maxLength: 6,
                    pattern: "^[0-9]{6}$",
                    example: "123456",
                  },

                  newPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    example: "NewPassword@123",
                    description:
                      "Must contain uppercase, lowercase, number and special character.",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Password reset successfully",
          },

          "400": {
            description: "Invalid or expired OTP",
          },
        },
      },
    },

    

    "/api/v1/user/me": {
      get: {
        tags: ["User"],
        summary: "Get my profile",
        description:
          "Get the authenticated user's profile.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description: "Profile retrieved successfully",
          },

          "401": {
            description: "Unauthorized",
          },
        },
      },

      patch: {
        tags: ["User"],
        summary: "Update my profile",
        description:
          "Update the authenticated user's profile.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "Rahima Begum",
                  },

                  phone: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678",
                  },

                  location: {
                    type: "string",
                    example: "Sylhet, Bangladesh",
                  },

                  profileImage: {
                    type: "string",
                    format: "uri",
                    example:
                      "https://res.cloudinary.com/example/image/upload/profile.jpg",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Profile updated successfully",
          },

          "400": {
            description: "Validation error",
          },

          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

   

    "/api/v1/blood-request": {
      post: {
        tags: ["Blood Request"],
        summary: "Create blood request",
        description:
          "Create a new blood request. Only recipients can create blood requests.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: [
                  "bloodGroup",
                  "hospitalName",
                  "requiredDate",
                ],

                properties: {
                  bloodGroup: {
                    type: "string",
                    enum: [
                      "A_POSITIVE",
                      "A_NEGATIVE",
                      "B_POSITIVE",
                      "B_NEGATIVE",
                      "AB_POSITIVE",
                      "AB_NEGATIVE",
                      "O_POSITIVE",
                      "O_NEGATIVE",
                    ],
                    example: "B_POSITIVE",
                  },

                  units: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                    example: 2,
                  },

                  hospitalName: {
                    type: "string",
                    minLength: 2,
                    example:
                      "Sylhet MAG Osmani Medical College Hospital",
                  },

                  hospitalAddress: {
                    type: "string",
                    example:
                      "Medical Road, Sylhet, Bangladesh",
                  },

                  requiredDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-09-10T10:00:00.000Z",
                  },

                  urgency: {
                    type: "string",
                    enum: [
                      "LOW",
                      "NORMAL",
                      "HIGH",
                      "CRITICAL",
                    ],
                    default: "NORMAL",
                    example: "HIGH",
                  },

                  contactNumber: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678",
                  },

                  patientName: {
                    type: "string",
                    minLength: 2,
                    example: "Rahima Begum",
                  },

                  notes: {
                    type: "string",
                    example:
                      "Urgently needed for surgery",
                  },
                },
              },
            },
          },
        },

        responses: {
          "201": {
            description: "Blood request created successfully",
          },

          "400": {
            description: "Validation error",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description: "Only recipients can create blood requests",
          },
        },
      },

      get: {
        tags: ["Blood Request"],
        summary: "Get all blood requests",
        description:
          "Get blood requests accessible to admin, donor and recipient users.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            description: "Page number",
          },

          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 10,
            },
            description: "Number of records per page",
          },

          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              example: "createdAt",
            },
            description: "Field to sort by",
          },

          {
            name: "sortOrder",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
            description: "Sort direction",
          },
        ],

        responses: {
          "200": {
            description: "Blood requests retrieved successfully",
          },

          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/api/v1/blood-request/search": {
      get: {
        tags: ["Blood Request"],
        summary: "Search blood requests",
        description:
          "Search blood requests using available query parameters.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "searchTerm",
            in: "query",
            schema: {
              type: "string",
              example: "Osmani",
            },
            description:
              "Search by relevant blood request information",
          },

          {
            name: "bloodGroup",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "A_POSITIVE",
                "A_NEGATIVE",
                "B_POSITIVE",
                "B_NEGATIVE",
                "AB_POSITIVE",
                "AB_NEGATIVE",
                "O_POSITIVE",
                "O_NEGATIVE",
              ],
              example: "B_POSITIVE",
            },
          },

          {
            name: "urgency",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "LOW",
                "NORMAL",
                "HIGH",
                "CRITICAL",
              ],
              example: "HIGH",
            },
          },

          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              example: "PENDING",
            },
          },

          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },

          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 10,
            },
          },
        ],

        responses: {
          "200": {
            description: "Blood requests search completed successfully",
          },

          "401": {
            description: "Unauthorized",
          },
        },
      },
    },

    "/api/v1/blood-request/{id}/verify": {
      patch: {
        tags: ["Blood Request"],
        summary: "Verify blood request",
        description:
          "Verify a blood request. Only admins can perform this action.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Blood request ID",
          },
        ],

        responses: {
          "200": {
            description: "Blood request verified successfully",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description: "Only admins can verify blood requests",
          },

          "404": {
            description: "Blood request not found",
          },
        },
      },
    },

    "/api/v1/blood-request/{id}/reject": {
      patch: {
        tags: ["Blood Request"],
        summary: "Reject blood request",
        description:
          "Reject a blood request. Only admins can perform this action.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Blood request ID",
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["rejectionReason"],

                properties: {
                  rejectionReason: {
                    type: "string",
                    minLength: 5,
                    maxLength: 500,
                    example:
                      "The submitted hospital information could not be verified.",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Blood request rejected successfully",
          },

          "400": {
            description: "Validation error",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description: "Only admins can reject blood requests",
          },

          "404": {
            description: "Blood request not found",
          },
        },
      },
    },

    "/api/v1/blood-request/{id}": {
      get: {
        tags: ["Blood Request"],
        summary: "Get blood request by ID",
        description:
          "Retrieve a specific blood request by its ID.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Blood request ID",
          },
        ],

        responses: {
          "200": {
            description: "Blood request retrieved successfully",
          },

          "401": {
            description: "Unauthorized",
          },

          "404": {
            description: "Blood request not found",
          },
        },
      },

      patch: {
        tags: ["Blood Request"],
        summary: "Update blood request",
        description:
          "Update an existing blood request. Only the recipient can update it.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Blood request ID",
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                properties: {
                  bloodGroup: {
                    type: "string",
                    enum: [
                      "A_POSITIVE",
                      "A_NEGATIVE",
                      "B_POSITIVE",
                      "B_NEGATIVE",
                      "AB_POSITIVE",
                      "AB_NEGATIVE",
                      "O_POSITIVE",
                      "O_NEGATIVE",
                    ],
                    example: "B_POSITIVE",
                  },

                  units: {
                    type: "integer",
                    minimum: 1,
                    example: 2,
                  },

                  hospitalName: {
                    type: "string",
                    minLength: 2,
                    example:
                      "Sylhet MAG Osmani Medical College Hospital",
                  },

                  hospitalAddress: {
                    type: "string",
                    example:
                      "Medical Road, Sylhet, Bangladesh",
                  },

                  requiredDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-09-10T10:00:00.000Z",
                  },

                  urgency: {
                    type: "string",
                    enum: [
                      "LOW",
                      "NORMAL",
                      "HIGH",
                      "CRITICAL",
                    ],
                    example: "HIGH",
                  },

                  contactNumber: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678",
                  },

                  patientName: {
                    type: "string",
                    minLength: 2,
                    example: "Rahima Begum",
                  },

                  notes: {
                    type: "string",
                    example:
                      "Urgently needed for surgery",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description: "Blood request updated successfully",
          },

          "400": {
            description: "Validation error",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description: "Only the recipient can update this request",
          },

          "404": {
            description: "Blood request not found",
          },
        },
      },

      delete: {
        tags: ["Blood Request"],
        summary: "Delete blood request",
        description:
          "Delete a blood request. Only the recipient can perform this action.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Blood request ID",
          },
        ],

        responses: {
          "200": {
            description: "Blood request deleted successfully",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description: "Only the recipient can delete this request",
          },

          "404": {
            description: "Blood request not found",
          },
        },
      },
    },
  

    "/api/v1/donor/me": {
      get: {
        tags: ["Donor"],
        summary: "Get my donor profile",
        description:
          "Retrieve the authenticated donor's profile.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          "200": {
            description:
              "Donor profile retrieved successfully",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description:
              "Only donors can access this endpoint",
          },

          "404": {
            description: "Donor profile not found",
          },
        },
      },
    },

    "/api/v1/donor/match/{bloodRequestId}": {
      get: {
        tags: ["Donor"],
        summary: "Match compatible donors",
        description:
          "Find compatible donors for a specific blood request. Accessible by recipients and admins.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "bloodRequestId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description:
              "Blood request ID",
          },
        ],

        responses: {
          "200": {
            description:
              "Compatible donors retrieved successfully",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description:
              "Only recipients and admins can access this endpoint",
          },

          "404": {
            description:
              "Blood request not found",
          },
        },
      },
    },

    "/api/v1/donor/nearby/{bloodRequestId}": {
      get: {
        tags: ["Donor"],
        summary: "Find nearby compatible donors",
        description:
          "Find compatible donors near the blood request location. Default radius is 20 km.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "bloodRequestId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description:
              "Blood request ID",
          },

          {
            name: "radius",
            in: "query",
            required: false,
            schema: {
              type: "number",
              minimum: 0.1,
              default: 20,
            },
            example: 20,
            description:
              "Search radius in kilometers. Defaults to 20 km.",
          },
        ],

        responses: {
          "200": {
            description:
              "Nearby compatible donors retrieved successfully",
          },

          "400": {
            description:
              "Radius must be a positive number",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description:
              "Only recipients and admins can access this endpoint",
          },

          "404": {
            description:
              "Blood request not found",
          },
        },
      },
    },

    "/api/v1/donor/availability": {
      patch: {
        tags: ["Donor"],
        summary: "Update donor availability",
        description:
          "Update the availability status of the authenticated donor.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: ["isAvailable"],

                properties: {
                  isAvailable: {
                    type: "boolean",
                    example: true,
                    description:
                      "Whether the donor is currently available to donate blood.",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description:
              "Donor availability updated successfully",
          },

          "400": {
            description:
              "isAvailable must be a boolean",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description:
              "Only donors can update availability",
          },
        },
      },
    },

    "/api/v1/donor/location": {
      patch: {
        tags: ["Donor"],
        summary: "Update donor location",
        description:
          "Update the authenticated donor's current location.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,

          content: {
            "application/json": {
              schema: {
                type: "object",

                required: [
                  "latitude",
                  "longitude",
                ],

                properties: {
                  latitude: {
                    type: "number",
                    example: 24.8949,
                    description:
                      "Donor latitude coordinate.",
                  },

                  longitude: {
                    type: "number",
                    example: 91.8687,
                    description:
                      "Donor longitude coordinate.",
                  },

                  address: {
                    type: "string",
                    example:
                      "Sylhet, Bangladesh",
                    description:
                      "Optional donor address.",
                  },
                },
              },
            },
          },
        },

        responses: {
          "200": {
            description:
              "Donor location updated successfully",
          },

          "400": {
            description:
              "Latitude and longitude must be numbers",
          },

          "401": {
            description: "Unauthorized",
          },

          "403": {
            description:
              "Only donors can update location",
          },
        },
      },
    },


    "/api/v1/donation": {
  post: {
    tags: ["Donation"],
    summary: "Create a donation",
    description: "Create a blood donation request/record. Only DONOR can create a donation.",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              bloodRequestId: {
                type: "string",
                format: "uuid",
                example: "9e8f8fbb-9b65-4cb6-a517-870e0d6b151a",
              },
            },
            required: ["bloodRequestId"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Donation created successfully",
      },
      400: {
        description: "Validation error",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only donor can create donation",
      },
    },
  },
},

"/api/v1/donation/my": {
  get: {
    tags: ["Donation"],
    summary: "Get my donations",
    description: "Retrieve donations created by the authenticated donor.",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Donations retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only donor can access this endpoint",
      },
    },
  },
},

"/api/v1/donation/{id}/approve": {
  patch: {
    tags: ["Donation"],
    summary: "Approve a donation",
    description: "Recipient approves a donor's donation.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
        description: "Donation ID",
      },
    ],
    responses: {
      200: {
        description: "Donation approved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only recipient can approve donation",
      },
      404: {
        description: "Donation not found",
      },
    },
  },
},

"/api/v1/donation/{id}/reject": {
  patch: {
    tags: ["Donation"],
    summary: "Reject a donation",
    description: "Recipient rejects a donor's donation.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
        description: "Donation ID",
      },
    ],
    responses: {
      200: {
        description: "Donation rejected successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only recipient can reject donation",
      },
      404: {
        description: "Donation not found",
      },
    },
  },
},
"/api/v1/payment/initiate": {
  post: {
    tags: ["Payment"],
    summary: "Initiate bKash payment",
    description: "Initiate a bKash payment for a blood request. Only RECIPIENT can initiate payment.",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              bloodRequestId: {
                type: "string",
                format: "uuid",
                example: "9e8f8fbb-9b65-4cb6-a517-870e0d6b151a",
              },
            },
            required: ["bloodRequestId"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Payment initiated successfully",
      },
      400: {
        description: "Validation error",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only recipient can initiate payment",
      },
    },
  },
},

"/api/v1/payment/execute/{paymentID}": {
  post: {
    tags: ["Payment"],
    summary: "Execute bKash payment",
    description: "Execute a previously initiated bKash payment.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "paymentID",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
        description: "bKash payment ID",
      },
    ],
    responses: {
      200: {
        description: "Payment executed successfully",
      },
      400: {
        description: "Payment execution failed",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only recipient can execute payment",
      },
      502: {
        description: "bKash gateway error",
      },
    },
  },
},

"/api/v1/payment/callback": {
  get: {
    tags: ["Payment"],
    summary: "bKash payment callback",
    description: "Callback endpoint used by bKash after payment processing.",
    parameters: [
      {
        name: "paymentID",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "status",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Payment callback processed successfully",
      },
      400: {
        description: "Invalid callback",
      },
    },
  },
},

"/api/v1/payment/my": {
  get: {
    tags: ["Payment"],
    summary: "Get my payments",
    description: "Retrieve all payments made by the authenticated recipient.",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Payments retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only recipient can access this endpoint",
      },
    },
  },
},

"/api/v1/payment/all": {
  get: {
    tags: ["Payment"],
    summary: "Get all payments",
    description: "Retrieve all payments. Only ADMIN can access this endpoint.",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "All payments retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can access this endpoint",
      },
    },
  },
},

"/api/v1/payment/{id}": {
  get: {
    tags: ["Payment"],
    summary: "Get payment by ID",
    description: "Retrieve a single payment by ID. Accessible by the payment owner or admin.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
        description: "Payment ID",
      },
    ],
    responses: {
      200: {
        description: "Payment retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Access denied",
      },
      404: {
        description: "Payment not found",
      },
    },
  },
},
"/api/v1/admin/users": {
  get: {
    tags: ["Admin"],
    summary: "Get all users",
    description: "Retrieve all users. Only ADMIN can access this endpoint.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 1,
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 10,
        },
      },
      {
        name: "searchTerm",
        in: "query",
        required: false,
        schema: {
          type: "string",
        },
      },
      {
        name: "role",
        in: "query",
        required: false,
        schema: {
          type: "string",
          enum: ["ADMIN", "DONOR", "RECIPIENT"],
        },
      },
    ],
    responses: {
      200: {
        description: "Users retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can access this endpoint",
      },
    },
  },
},

"/api/v1/admin/users/{id}/block": {
  patch: {
    tags: ["Admin"],
    summary: "Block a user",
    description: "Block a user account. Only ADMIN can access this endpoint.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
        description: "User ID",
      },
    ],
    responses: {
      200: {
        description: "User blocked successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can block users",
      },
      404: {
        description: "User not found",
      },
    },
  },
},

"/api/v1/admin/users/{id}/unblock": {
  patch: {
    tags: ["Admin"],
    summary: "Unblock a user",
    description: "Unblock a previously blocked user account.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
        description: "User ID",
      },
    ],
    responses: {
      200: {
        description: "User unblocked successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can unblock users",
      },
      404: {
        description: "User not found",
      },
    },
  },
},

"/api/v1/admin/dashboard-stats": {
  get: {
    tags: ["Admin"],
    summary: "Get dashboard statistics",
    description: "Retrieve platform dashboard statistics. Only ADMIN can access this endpoint.",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Dashboard statistics retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can access this endpoint",
      },
    },
  },
},

"/api/v1/admin/audit-logs": {
  get: {
    tags: ["Admin"],
    summary: "Get audit logs",
    description: "Retrieve system audit logs. Only ADMIN can access this endpoint.",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 1,
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: {
          type: "integer",
          minimum: 1,
          default: 10,
        },
      },
    ],
    responses: {
      200: {
        description: "Audit logs retrieved successfully",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Only admin can access this endpoint",
      },
    },
  },
},
  },
};

export const setupSwagger = (app: Application) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};