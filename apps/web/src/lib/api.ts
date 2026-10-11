/**
 * API client module for Abious Frontend.
 * Production-ready, zero third-party dependencies, SSR-safe.
 *
 * Implements Solid 2.0 data fetching and error handling patterns:
 * - Direct rejection on non-2xx status codes
 * - Unpacking of standard backend envelope: { success: true, data: T }
 * - SSR base URL resolution using server/browser awareness
 */
import { isServer } from "solid-js/web";

// In SSR mode inside DDEV/Node/Nitro, access API via internal container URL or env.
// In client browser mode, access via public VITE_API_URL or current domain.
export const getApiBaseUrl = (): string => {
  if (typeof process !== "undefined" && process.env?.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (isServer) {
    // In DDEV SSR environment, the NestJS server is reachable at http://127.0.0.1:3000
    return "http://127.0.0.1:3000";
  }
  // Browser fallback defaults to current origin or public API domain
  return "https://api.abious.ddev.site";
};

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard fetch helper that unwraps `{ success: true, data: T }` envelope.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
  };

  if (options.body && typeof options.body === "string") {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
    let errorData: any = null;
    try {
      errorData = await response.json();
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {
      // Body not JSON
    }
    throw new ApiError(errorMessage, response.status, errorData);
  }

  const json = await response.json();
  // Unwrap standard envelope if present: { success: true, data: ... }
  if (json && typeof json === "object" && "success" in json && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

// Data models
export interface ISiteSettings {
  siteName: string;
  siteTitle: string;
  bio: string;
  email: string;
  phone: string;
  resumeUrl: string;
  calcomLink: string;
  socials: Array<{
    id: string;
    url: string;
    title: string;
  }>;
}

export interface IServiceItem {
  id: string | number;
  slug?: string;
  title: string;
  description: string;
  icon: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IExperiencePosition {
  id: string | number;
  title: string;
  startDate: string;
  endDate: string;
  type: string;
}

export interface IExperienceItem {
  id: string | number;
  company: string;
  location: string;
  logo: string;
  sortOrder?: number;
  positions: IExperiencePosition[];
}

export interface ITestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  body: string;
  rating?: number;
  data?: {
    name?: string;
    role?: string;
    company?: string;
    avatar?: string;
  };
}


export interface ICaseStudyItem {
  id: string;
  slug?: string;
  data: {
    title: string;
    description: string;
    banner: string;
    liveURL?: string;
    type?: string;
    stack?: string[];
    createdAt?: string;
  };
  body?: string;
}

export interface IContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface IContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Modular API Client
export const api = {
  settings: {
    getPublic: (): Promise<ISiteSettings> => request<ISiteSettings>("/api/settings/public"),
  },
  services: {
    list: (): Promise<IServiceItem[]> => request<IServiceItem[]>("/api/services"),
  },
  experience: {
    list: (): Promise<IExperienceItem[]> => request<IExperienceItem[]>("/api/experience"),
  },
  testimonials: {
    list: (): Promise<ITestimonialItem[]> => request<ITestimonialItem[]>("/api/testimonials"),
  },
  caseStudies: {
    list: (): Promise<ICaseStudyItem[]> => request<ICaseStudyItem[]>("/api/case-studies"),
    get: (id: string): Promise<ICaseStudyItem | null> => request<ICaseStudyItem | null>(`/api/case-studies/${id}`),
    related: (id: string, type?: string): Promise<ICaseStudyItem[]> => {
      const typeParam = type ? `/${encodeURIComponent(type)}` : "";
      return request<ICaseStudyItem[]>(`/api/case-studies/${id}${typeParam}/related`);
    },
  },
  contact: {
    submit: (payload: IContactPayload): Promise<IContactResponse> =>
      request<IContactResponse>("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};
