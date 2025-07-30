import { cookies, headers } from 'next/headers';

interface ApiClientOptions {
  tags?: string[];
  revalidate?: number | false;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || 'http://localhost:4000';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiClientOptions = {}
  ): Promise<T> {
    const { tags = [], revalidate, ...fetchOptions } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    // Always add API key to headers
    const apiKey = await this.getApiKey();
    if (apiKey) {
      defaultHeaders['api-key'] = apiKey;
    }

    const finalHeaders = {
      ...defaultHeaders,
      ...fetchOptions.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: finalHeaders,
        next: {
          tags,
          revalidate,
        },
      });
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          throw new ApiError(
            'Não autorizado. Verifique sua chave API.',
            response.status,
            await response.text()
          );
        }
        
        throw new ApiError(
          `API Error: ${response.status}`,
          response.status,
          await response.text()
        );
      }
      
      if (response.status !== 204 && response.status !== 201) {
        return await response.json();
      } else {
        return (response as T)
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network Error', 500, 'Failed to connect to API');
    }
  }

  private async getApiKey(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      const apiKeyFromCookie = cookieStore.get('api-key')?.value;
      
      if (apiKeyFromCookie) {
        return apiKeyFromCookie;
      }

      // Fallback to header (useful for API routes)
      const headersList = await headers();
      const apiKeyFromHeader = headersList.get('x-api-key');
      
      return apiKeyFromHeader;
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  async get<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string, 
    data?: any, 
    options?: ApiClientOptions
  ): Promise<T> {
    let bodyData

    if (data instanceof FormData) {
      bodyData = data
    } else {
      bodyData = JSON.stringify(data)
    }

    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: bodyData,
    });
  }

  async put<T>(
    endpoint: string, 
    data?: any, 
    options?: ApiClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string, 
    data?: any, 
    options?: ApiClientOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: ApiClientOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();