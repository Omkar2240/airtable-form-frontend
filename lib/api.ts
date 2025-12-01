const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = {
  async fetch(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return res;
  },

  async get(endpoint: string, headers?: Record<string, string>) {
    const res = await this.fetch(endpoint, { headers });
    return res.json();
  },

  async post(endpoint: string, body?: any, headers?: Record<string, string>) {
    const res = await this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
    return res.json();
  },
};
