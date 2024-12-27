import handleError from '@/lib/handlers/error';
import { RequestError } from '@/lib/http-error';
import logger from '@/lib/logger';
import { ActionResponse } from '@/types/global';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
  attempt: number = 1,
): Promise<ActionResponse<T>> {
  const {
    timeout = 10000,
    retries = 3,
    headers: customHeaders,
    ...restOptions
  } = options;

  const controller = new AbortController();

  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error('Unknown error');
    if (error.name === 'AbortError') {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }
    if (attempt < retries) {
      const nextDelay = Math.min(1000 * 2 ** attempt, 10000); // Exponential backoff, max 10 seconds
      logger.info(`Retrying in ${nextDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, nextDelay));
      return fetchHandler<T>(url, options, attempt + 1);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
