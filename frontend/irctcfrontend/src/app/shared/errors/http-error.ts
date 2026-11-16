import { HttpErrorResponse } from '@angular/common/http';

export function isConflictError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 409;
}

export function getHttpErrorMessage(
  error: unknown,
  fallback = 'Unable to complete the request. Please try again.',
): string {
  if (error instanceof HttpErrorResponse) {
    const response = error.error;
    const responseMessage =
      typeof response === 'string'
        ? response
        : response?.detail ?? response?.message;

    return responseMessage || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
