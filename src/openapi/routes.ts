import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { ZodType } from 'zod';
import { z } from 'zod';

import { adminNotesPaginationSchema } from '../core/admin-notes/admin-notes.validation';
import {
  adminUsersPaginationSchema,
  createAdminUserSchema,
  updateAdminUserSchema,
  userIdSchema,
} from '../core/admin-users/admin-users.validation';
import { loginSchema, registerSchema } from '../core/auth/auth.validation';
import {
  createNoteSchema,
  noteIdSchema,
  paginationSchema,
  updateNoteSchema,
} from '../core/notes/notes.validation';
import { createPostSchema, postsPaginationSchema } from '../core/posts/posts.validation';
import { userPostsUserIdSchema } from '../core/user-posts/user-posts.validation';
import {
  errorResponseSchema,
  healthResponseSchema,
  interestGroupsResponseSchema,
  loginResponseSchema,
  noteResponseSchema,
  notesListResponseSchema,
  postResponseSchema,
  postsListResponseSchema,
  userPostsResponseSchema,
  userResponseSchema,
  usersListResponseSchema,
} from './schemas';

const bearerSecurity = [{ bearerAuth: [] }];

function jsonResponse(description: string, schema: ZodType) {
  return {
    description,
    content: {
      'application/json': {
        schema,
      },
    },
  };
}

function requestBody(schema: ZodType) {
  return {
    required: true,
    content: {
      'application/json': {
        schema,
      },
    },
  };
}

export function registerApiPaths(registry: OpenAPIRegistry): void {
  const errorResponse = registry.register('ErrorResponse', errorResponseSchema);
  const userResponse = registry.register('UserResponse', userResponseSchema);
  const noteResponse = registry.register('NoteResponse', noteResponseSchema);
  const postResponse = registry.register('PostResponse', postResponseSchema);
  const notesListResponse = registry.register('NotesListResponse', notesListResponseSchema);
  const postsListResponse = registry.register('PostsListResponse', postsListResponseSchema);
  const usersListResponse = registry.register('UsersListResponse', usersListResponseSchema);
  const loginResponse = registry.register('LoginResponse', loginResponseSchema);
  const healthResponse = registry.register('HealthResponse', healthResponseSchema);
  const userPostsResponse = registry.register('UserPostsResponse', userPostsResponseSchema);
  const interestGroupsResponse = registry.register(
    'InterestGroupsResponse',
    interestGroupsResponseSchema,
  );
  const badRequest = jsonResponse('Invalid request', errorResponse);
  const unauthorized = jsonResponse('Authentication is required', errorResponse);
  const forbidden = jsonResponse('Administrator access is required', errorResponse);
  const notFound = jsonResponse('Resource not found', errorResponse);
  const conflict = jsonResponse('Resource already exists', errorResponse);
  const serverError = jsonResponse('Internal server error', errorResponse);

  registry.registerPath({
    method: 'get',
    path: '/api/v1/health',
    summary: 'Check service health',
    responses: {
      200: jsonResponse('Service is healthy', healthResponse),
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/register',
    summary: 'Register a user',
    request: { body: requestBody(registerSchema) },
    responses: {
      201: jsonResponse('User registered', userResponse),
      400: badRequest,
      500: serverError,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/login',
    summary: 'Log in',
    request: { body: requestBody(loginSchema) },
    responses: {
      200: jsonResponse('Authentication token', loginResponse),
      400: badRequest,
      401: unauthorized,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/users/me',
    summary: 'Get the current user',
    security: bearerSecurity,
    responses: {
      200: jsonResponse('Current user', userResponse),
      401: unauthorized,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/users/{userId}/posts',
    summary: "Get a user's posts",
    request: {
      params: z.object({ userId: userPostsUserIdSchema }),
    },
    responses: {
      200: jsonResponse('User and their posts', userPostsResponse),
      400: badRequest,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/notes',
    summary: "List the current user's notes",
    security: bearerSecurity,
    request: { query: paginationSchema },
    responses: {
      200: jsonResponse('Paginated notes', notesListResponse),
      400: badRequest,
      401: unauthorized,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/notes',
    summary: 'Create a note',
    security: bearerSecurity,
    request: { body: requestBody(createNoteSchema) },
    responses: {
      201: jsonResponse('Note created', noteResponse),
      400: badRequest,
      401: unauthorized,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/notes/{noteId}',
    summary: 'Get an owned note',
    security: bearerSecurity,
    request: { params: z.object({ noteId: noteIdSchema }) },
    responses: {
      200: jsonResponse('Owned note', noteResponse),
      400: badRequest,
      401: unauthorized,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/notes/{noteId}',
    summary: 'Update an owned note',
    security: bearerSecurity,
    request: {
      params: z.object({ noteId: noteIdSchema }),
      body: requestBody(updateNoteSchema),
    },
    responses: {
      200: jsonResponse('Note updated', noteResponse),
      400: badRequest,
      401: unauthorized,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/notes/{noteId}',
    summary: 'Delete an owned note',
    security: bearerSecurity,
    request: { params: z.object({ noteId: noteIdSchema }) },
    responses: {
      204: { description: 'Note deleted' },
      400: badRequest,
      401: unauthorized,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/posts',
    summary: 'List public posts',
    request: { query: postsPaginationSchema },
    responses: {
      200: jsonResponse('Paginated public posts', postsListResponse),
      400: badRequest,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/posts',
    summary: 'Create a post',
    security: bearerSecurity,
    request: { body: requestBody(createPostSchema) },
    responses: {
      201: jsonResponse('Post created', postResponse),
      400: badRequest,
      401: unauthorized,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/admin/users',
    summary: 'List all users',
    security: bearerSecurity,
    request: { query: adminUsersPaginationSchema },
    responses: {
      200: jsonResponse('Paginated users', usersListResponse),
      400: badRequest,
      401: unauthorized,
      403: forbidden,
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/v1/admin/users',
    summary: 'Create a user',
    security: bearerSecurity,
    request: { body: requestBody(createAdminUserSchema) },
    responses: {
      201: jsonResponse('User created', userResponse),
      400: badRequest,
      401: unauthorized,
      403: forbidden,
      409: conflict,
    },
  });

  registry.registerPath({
    method: 'patch',
    path: '/api/v1/admin/users/{userId}',
    summary: 'Update a user',
    security: bearerSecurity,
    request: {
      params: z.object({ userId: userIdSchema }),
      body: requestBody(updateAdminUserSchema),
    },
    responses: {
      200: jsonResponse('User updated', userResponse),
      400: badRequest,
      401: unauthorized,
      403: forbidden,
      404: notFound,
      409: conflict,
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/v1/admin/users/{userId}',
    summary: 'Delete a user',
    security: bearerSecurity,
    request: { params: z.object({ userId: userIdSchema }) },
    responses: {
      204: { description: 'User deleted' },
      400: badRequest,
      401: unauthorized,
      403: forbidden,
      404: notFound,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/admin/notes',
    summary: 'List all notes',
    security: bearerSecurity,
    request: { query: adminNotesPaginationSchema },
    responses: {
      200: jsonResponse('Paginated notes', notesListResponse),
      400: badRequest,
      401: unauthorized,
      403: forbidden,
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/v1/admin/user-interest-groups',
    summary: 'Group users by interest',
    security: bearerSecurity,
    responses: {
      200: jsonResponse('Users grouped by interest', interestGroupsResponse),
      401: unauthorized,
      403: forbidden,
    },
  });
}
