// OpenAPI 3.0 spec for Sodiq School backend.
// Mounted at GET /api/docs (Swagger UI) and GET /api/docs.json (raw spec).
import { env } from '../config/env.js';

const ok = { description: 'OK' };
const created = { description: 'Created' };
const noContent = { description: 'OK' };
const unauthorized = { description: 'Missing or invalid Authorization header' };
const notFound = { description: 'Not found' };
const validationError = { description: 'Validation error (Zod)' };

const bearer = [{ bearerAuth: [] }];
const ID_PARAM = { name: 'id', in: 'path', required: true, schema: { type: 'integer' } };

// ---------- Common shapes ----------
const schemas = {
  Error: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      details: { type: 'object', nullable: true },
    },
  },
  AdminUser: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email' },
      name: { type: 'string' },
      role: { type: 'string', enum: ['superadmin', 'admin', 'editor'] },
      is_active: { type: 'integer', enum: [0, 1] },
      created_at: { type: 'string', format: 'date-time' },
    },
  },
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      user: { $ref: '#/components/schemas/AdminUser' },
    },
  },
  ChangePasswordRequest: {
    type: 'object',
    required: ['current_password', 'new_password'],
    properties: {
      current_password: { type: 'string' },
      new_password: { type: 'string', minLength: 6 },
    },
  },
  ApplicationSubmissionInput: {
    type: 'object',
    required: ['name', 'phone'],
    properties: {
      name: { type: 'string', maxLength: 150 },
      phone: { type: 'string', maxLength: 40 },
      message: { type: 'string', nullable: true, maxLength: 5000 },
      grade: { type: 'string', nullable: true, maxLength: 20 },
      region: { type: 'string', nullable: true, maxLength: 120 },
      source_form: { type: 'string', maxLength: 60, example: 'contact' },
    },
  },
  ApplicationSubmission: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      source_form: { type: 'string' },
      name: { type: 'string' },
      phone: { type: 'string' },
      message: { type: 'string', nullable: true },
      grade: { type: 'string', nullable: true },
      region: { type: 'string', nullable: true },
      status: { type: 'string', enum: ['new', 'contacted', 'closed'] },
      notes: { type: 'string', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
    },
  },
  ApplicationUpdate: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['new', 'contacted', 'closed'] },
      notes: { type: 'string', nullable: true, maxLength: 5000 },
    },
  },
  Webhook: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      url: { type: 'string', format: 'uri' },
      method: { type: 'string', enum: ['POST', 'PUT', 'PATCH'] },
      secret: { type: 'string', nullable: true },
      event_types: { type: 'array', items: { type: 'string' }, example: ['application.created'] },
      selected_fields: {
        type: 'array',
        items: { type: 'string' },
        example: ['name', 'phone', 'grade', 'region', 'message', 'source_form'],
      },
      custom_headers: { type: 'object', additionalProperties: { type: 'string' } },
      payload_template: { type: 'string', nullable: true },
      include_metadata: { type: 'boolean' },
      retry_count: { type: 'integer', minimum: 1, maximum: 10 },
      timeout_ms: { type: 'integer', minimum: 1000, maximum: 60000 },
      is_active: { type: 'boolean' },
      is_archived: { type: 'boolean' },
      archived_at: { type: 'string', format: 'date-time', nullable: true },
      last_success_at: { type: 'string', format: 'date-time', nullable: true },
      last_error_at: { type: 'string', format: 'date-time', nullable: true },
      last_error: { type: 'string', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' },
    },
  },
  WebhookInput: {
    type: 'object',
    required: ['name', 'url'],
    properties: {
      name: { type: 'string', maxLength: 150 },
      url: { type: 'string', format: 'uri', maxLength: 1000 },
      method: { type: 'string', enum: ['POST', 'PUT', 'PATCH'], default: 'POST' },
      secret: { type: 'string', nullable: true, maxLength: 255 },
      event_types: { type: 'array', items: { type: 'string' } },
      selected_fields: { type: 'array', items: { type: 'string' } },
      custom_headers: { type: 'object', additionalProperties: { type: 'string' } },
      payload_template: { type: 'string', nullable: true },
      include_metadata: { type: 'boolean' },
      retry_count: { type: 'integer', minimum: 1, maximum: 10 },
      timeout_ms: { type: 'integer', minimum: 1000, maximum: 60000 },
      is_active: { type: 'boolean' },
    },
  },
  WebhookMeta: {
    type: 'object',
    properties: {
      fields: {
        type: 'array',
        items: { type: 'object', properties: { key: { type: 'string' }, label: { type: 'string' } } },
      },
      events: {
        type: 'array',
        items: { type: 'object', properties: { key: { type: 'string' }, label: { type: 'string' } } },
      },
    },
  },
  WebhookTestResult: {
    type: 'object',
    properties: {
      ok: { type: 'boolean' },
      status: { type: 'integer', nullable: true },
      error: { type: 'string', nullable: true },
      durationMs: { type: 'integer' },
      responsePreview: { type: 'string', nullable: true },
    },
  },
  WebhookDelivery: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      event_type: { type: 'string' },
      target_url: { type: 'string' },
      response_status: { type: 'integer', nullable: true },
      error: { type: 'string', nullable: true },
      attempts: { type: 'integer' },
      duration_ms: { type: 'integer', nullable: true },
      success: { type: 'integer', enum: [0, 1] },
      created_at: { type: 'string', format: 'date-time' },
    },
  },
  WebhookDeliveryFull: {
    allOf: [
      { $ref: '#/components/schemas/WebhookDelivery' },
      {
        type: 'object',
        properties: {
          webhook_id: { type: 'integer' },
          request_body: { type: 'string', nullable: true },
          response_body: { type: 'string', nullable: true },
        },
      },
    ],
  },
  MediaItem: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      filename: { type: 'string' },
      url: { type: 'string' },
      mime_type: { type: 'string', nullable: true },
      size_bytes: { type: 'integer', nullable: true },
      alt_text: { type: 'string', nullable: true },
      created_at: { type: 'string', format: 'date-time' },
    },
  },
  UploadResponse: {
    type: 'object',
    properties: { id: { type: 'integer' }, url: { type: 'string' } },
  },
  GenericRow: {
    type: 'object',
    description: 'Generic resource row (DB-shaped object — fields vary by resource).',
    additionalProperties: true,
  },
  GenericList: {
    type: 'object',
    properties: {
      items: { type: 'array', items: { $ref: '#/components/schemas/GenericRow' } },
    },
  },
};

const responses = {
  Error: {
    description: 'Error response',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
};

// ---------- Generic CRUD path generator ----------
// All "resource" endpoints follow the same pattern:
//   GET /api/<name>            public list
//   GET /api/<name>/:id        public single (some)
//   POST /api/<name>           admin create
//   PUT /api/<name>/:id        admin update
//   DELETE /api/<name>/:id     admin delete
function crudPaths(resource, tag) {
  return {
    [`/api/${resource}`]: {
      get: {
        tags: [tag],
        summary: `List ${resource}`,
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': {
              schema: { oneOf: [
                { type: 'array', items: { $ref: '#/components/schemas/GenericRow' } },
                { $ref: '#/components/schemas/GenericList' },
              ] } } },
          },
        },
      },
      post: {
        tags: [tag],
        summary: `Create ${resource}`,
        security: bearer,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GenericRow' } } },
        },
        responses: { 201: created, 400: validationError, 401: unauthorized },
      },
    },
    [`/api/${resource}/{id}`]: {
      parameters: [ID_PARAM],
      get: {
        tags: [tag],
        summary: `Get one ${resource}`,
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/GenericRow' } } } },
          404: notFound,
        },
      },
      put: {
        tags: [tag],
        summary: `Update ${resource}`,
        security: bearer,
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/GenericRow' } } },
        },
        responses: { 200: ok, 400: validationError, 401: unauthorized, 404: notFound },
      },
      delete: {
        tags: [tag],
        summary: `Delete ${resource}`,
        security: bearer,
        responses: { 200: noContent, 401: unauthorized, 404: notFound },
      },
    },
  };
}

// Each resource handled by a generic-CRUD router on the project.
const CRUD_RESOURCES = [
  ['teachers', 'Teachers'],
  ['top-students', 'Top Students'],
  ['alumni', 'Alumni'],
  ['exam-results', 'Exam Results'],
  ['awards', 'Awards'],
  ['universities', 'Universities'],
  ['blog', 'Blog'],
  ['exam-courses', 'Exam Courses'],
  ['exam-course-sections', 'Exam Course Sections'],
  ['lesson-subjects', 'Lesson Subjects'],
  ['lesson-extras', 'Lesson Extras'],
  ['pricing-plans', 'Pricing Plans'],
  ['advantages', 'Advantages'],
  ['about-stats', 'About Stats'],
  ['gallery', 'Gallery'],
  ['faqs', 'FAQs'],
  ['testimonial-videos', 'Testimonial Videos'],
  ['carousel', 'Carousel'],
  ['settings', 'Settings'],
];

const crudPathBlocks = CRUD_RESOURCES.reduce((acc, [name, tag]) => {
  Object.assign(acc, crudPaths(name, tag));
  return acc;
}, {});

// ---------- Hand-written paths (high-detail) ----------
const paths = {
  '/api/health': {
    get: {
      tags: ['System'],
      summary: 'Health check',
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { ok: { type: 'boolean' } } } } } } },
    },
  },

  // ----- Auth -----
  '/api/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Login (returns JWT token)',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } } },
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
        401: { description: 'Invalid credentials' },
      },
    },
  },
  '/api/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Current user',
      security: bearer,
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/AdminUser' } } } } } },
        401: unauthorized,
      },
    },
  },
  '/api/auth/change-password': {
    post: {
      tags: ['Auth'],
      summary: 'Change current user password',
      security: bearer,
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } } },
      responses: { 200: ok, 400: { description: 'Current password incorrect' }, 401: unauthorized },
    },
  },

  // ----- Users (admin CRUD) -----
  '/api/users': {
    get: {
      tags: ['Users'],
      summary: 'List admin users',
      security: bearer,
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/AdminUser' } } } } } } },
        401: unauthorized,
      },
    },
    post: {
      tags: ['Users'],
      summary: 'Create admin user',
      security: bearer,
      requestBody: { required: true, content: { 'application/json': { schema: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
        },
      } } } },
      responses: { 201: created, 400: validationError, 401: unauthorized },
    },
  },
  '/api/users/{id}': {
    parameters: [ID_PARAM],
    get: {
      tags: ['Users'],
      security: bearer,
      summary: 'Get admin user',
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminUser' } } } }, 401: unauthorized, 404: notFound },
    },
    put: {
      tags: ['Users'],
      security: bearer,
      summary: 'Update admin user',
      requestBody: { required: true, content: { 'application/json': { schema: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['superadmin', 'admin', 'editor'] },
          is_active: { type: 'boolean' },
        },
      } } } },
      responses: { 200: ok, 400: validationError, 401: unauthorized, 404: notFound },
    },
    delete: {
      tags: ['Users'],
      security: bearer,
      summary: 'Delete admin user',
      responses: { 200: noContent, 401: unauthorized, 404: notFound },
    },
  },

  // ----- Upload / Media -----
  '/api/upload': {
    post: {
      tags: ['Upload'],
      summary: 'Upload one file (multipart/form-data, field: file)',
      security: bearer,
      requestBody: {
        required: true,
        content: { 'multipart/form-data': { schema: {
          type: 'object',
          properties: { file: { type: 'string', format: 'binary' }, alt_text: { type: 'string' } },
        } } },
      },
      responses: {
        201: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/UploadResponse' } } } },
        401: unauthorized,
      },
    },
  },
  '/api/media': {
    get: {
      tags: ['Media'],
      summary: 'List uploaded media',
      security: bearer,
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/MediaItem' } } } } } } },
        401: unauthorized,
      },
    },
  },
  '/api/media/{id}': {
    parameters: [ID_PARAM],
    delete: {
      tags: ['Media'],
      security: bearer,
      summary: 'Delete media',
      responses: { 200: noContent, 401: unauthorized, 404: notFound },
    },
  },

  // ----- Public site aggregator -----
  '/api/public-site': {
    get: {
      tags: ['Public Site'],
      summary: 'Get the whole site bundle for one locale (public)',
      parameters: [
        { name: 'locale', in: 'query', schema: { type: 'string', enum: ['uz', 'ru', 'en'], default: 'uz' } },
      ],
      responses: { 200: { description: 'Aggregated site data', content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } } },
    },
  },

  // ----- Applications (lead/form) -----
  '/api/applications': {
    post: {
      tags: ['Applications'],
      summary: 'Public form submission (creates a lead, triggers email + webhooks)',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplicationSubmissionInput' } } } },
      responses: { 201: created, 400: validationError },
    },
    get: {
      tags: ['Applications'],
      summary: 'List submissions (admin inbox)',
      security: bearer,
      parameters: [
        { name: 'status', in: 'query', schema: { type: 'string', enum: ['new', 'contacted', 'closed'] } },
      ],
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/ApplicationSubmission' } } } } } } },
        401: unauthorized,
      },
    },
  },
  '/api/applications/{id}': {
    parameters: [ID_PARAM],
    get: {
      tags: ['Applications'],
      security: bearer,
      summary: 'Get one submission',
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplicationSubmission' } } } }, 401: unauthorized, 404: notFound },
    },
    put: {
      tags: ['Applications'],
      security: bearer,
      summary: 'Update submission (status / notes)',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ApplicationUpdate' } } } },
      responses: { 200: ok, 400: validationError, 401: unauthorized, 404: notFound },
    },
    delete: {
      tags: ['Applications'],
      security: bearer,
      summary: 'Delete submission',
      responses: { 200: noContent, 401: unauthorized, 404: notFound },
    },
  },

  // ----- Webhooks (multi-target lead forwarding) -----
  '/api/webhooks/meta': {
    get: {
      tags: ['Webhooks'],
      summary: 'Available fields and events for webhook configuration',
      security: bearer,
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/WebhookMeta' } } } }, 401: unauthorized },
    },
  },
  '/api/webhooks': {
    get: {
      tags: ['Webhooks'],
      summary: 'List webhooks (default: active; ?archived=1 for archived)',
      security: bearer,
      parameters: [
        { name: 'archived', in: 'query', schema: { type: 'string', enum: ['0', '1'] }, description: 'Pass 1 to list archived webhooks' },
      ],
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/Webhook' } } } } } } },
        401: unauthorized,
      },
    },
    post: {
      tags: ['Webhooks'],
      summary: 'Create webhook',
      security: bearer,
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WebhookInput' } } } },
      responses: {
        201: { description: 'Created', content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'integer' } } } } } },
        400: validationError, 401: unauthorized,
      },
    },
  },
  '/api/webhooks/{id}': {
    parameters: [ID_PARAM],
    get: {
      tags: ['Webhooks'],
      summary: 'Get one webhook',
      security: bearer,
      responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Webhook' } } } }, 401: unauthorized, 404: notFound },
    },
    put: {
      tags: ['Webhooks'],
      summary: 'Update webhook (partial)',
      security: bearer,
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/WebhookInput' } } } },
      responses: { 200: ok, 400: validationError, 401: unauthorized, 404: notFound },
    },
    delete: {
      tags: ['Webhooks'],
      summary: 'Hard-delete webhook (cascades deliveries)',
      security: bearer,
      responses: { 200: noContent, 401: unauthorized, 404: notFound },
    },
  },
  '/api/webhooks/{id}/archive': {
    parameters: [ID_PARAM],
    post: {
      tags: ['Webhooks'],
      summary: 'Archive (soft-delete) a webhook',
      security: bearer,
      responses: { 200: ok, 401: unauthorized, 404: notFound },
    },
  },
  '/api/webhooks/{id}/restore': {
    parameters: [ID_PARAM],
    post: {
      tags: ['Webhooks'],
      summary: 'Restore an archived webhook',
      security: bearer,
      responses: { 200: ok, 401: unauthorized, 404: notFound },
    },
  },
  '/api/webhooks/{id}/test': {
    parameters: [ID_PARAM],
    post: {
      tags: ['Webhooks'],
      summary: 'Send a sample payload to the webhook URL using current saved config',
      security: bearer,
      responses: {
        200: { description: 'Delivery result', content: { 'application/json': { schema: { $ref: '#/components/schemas/WebhookTestResult' } } } },
        401: unauthorized, 404: notFound,
      },
    },
  },
  '/api/webhooks/{id}/deliveries': {
    parameters: [ID_PARAM],
    get: {
      tags: ['Webhooks'],
      summary: 'Recent delivery attempts for a webhook',
      security: bearer,
      parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 100, maximum: 500 } }],
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/WebhookDelivery' } } } } } } },
        401: unauthorized,
      },
    },
  },
  '/api/webhooks/{id}/deliveries/{deliveryId}': {
    parameters: [
      ID_PARAM,
      { name: 'deliveryId', in: 'path', required: true, schema: { type: 'integer' } },
    ],
    get: {
      tags: ['Webhooks'],
      summary: 'Full body of one delivery (request + response)',
      security: bearer,
      responses: {
        200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/WebhookDeliveryFull' } } } },
        401: unauthorized, 404: notFound,
      },
    },
  },

  // ----- Generic CRUD resources -----
  ...crudPathBlocks,
};

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Sodiq School API',
    version: '1.0.0',
    description:
      'REST API for Sodiq School. Public endpoints (no auth) feed the public site; /api/applications POST creates a lead and triggers email + multi-webhook delivery. Admin endpoints require Bearer JWT.',
  },
  servers: [
    { url: `http://localhost:${env.port}`, description: 'Local' },
    { url: env.publicBaseUrl, description: 'Public base URL (env PUBLIC_BASE_URL)' },
  ],
  tags: [
    { name: 'System' },
    { name: 'Auth' },
    { name: 'Users' },
    { name: 'Upload' },
    { name: 'Media' },
    { name: 'Public Site' },
    { name: 'Applications', description: 'Form submissions (leads)' },
    { name: 'Webhooks', description: 'Multi-target lead forwarding to external systems' },
    ...CRUD_RESOURCES.map(([, tag]) => ({ name: tag })),
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas,
    responses,
  },
  paths,
};

export default openapiSpec;
