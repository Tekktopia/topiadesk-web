/**
 * Minimal typed client for the Topiadesk REST API.
 * Every client instance is bound to a single tenant.
 */

export interface TopiadeskClientOptions {
  /** Tenant subdomain, e.g. "consomoafrica". */
  tenant: string;
  /** Bearer token for authenticated requests. */
  token?: string;
  /** Override the API origin (defaults to https://{tenant}.topiadesk.com). */
  baseUrl?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  requesterEmail?: string;
  createdAt: string;
}

export interface CreateTicketInput {
  subject: string;
  description: string;
  requesterEmail: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
}

export class TopiadeskApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'TopiadeskApiError';
  }
}

export class TopiadeskClient {
  private readonly baseUrl: string;
  private readonly token: string | undefined;

  constructor(options: TopiadeskClientOptions) {
    this.baseUrl =
      options.baseUrl ?? `https://${options.tenant}.topiadesk.com/api/v1`;
    this.token = options.token;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token !== undefined) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: { ...headers, ...init?.headers },
    });

    if (!response.ok) {
      throw new TopiadeskApiError(
        response.status,
        `Topiadesk API request failed: ${response.status}`,
      );
    }
    return (await response.json()) as T;
  }

  /** List tickets for the bound tenant. */
  listTickets(): Promise<Ticket[]> {
    return this.request<Ticket[]>('/tickets');
  }

  /** Retrieve a single ticket by id. */
  getTicket(id: string): Promise<Ticket> {
    return this.request<Ticket>(`/tickets/${encodeURIComponent(id)}`);
  }

  /** Create a ticket for the bound tenant. */
  createTicket(input: CreateTicketInput): Promise<Ticket> {
    return this.request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }
}
