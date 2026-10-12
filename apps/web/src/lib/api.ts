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
    credentials: "include",
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

export interface IBlogPostItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  isDraft?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IAuditLogItem {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface IReportOverview {
  totalBlogs?: number;
  totalCaseStudies?: number;
  totalServices?: number;
  totalInquiries?: number;
  recentAuditLogs?: IAuditLogItem[];
  [key: string]: any;
}

// Modular API Client
export const api = {
  auth: {
    getSession: (): Promise<{ authenticated: boolean; session: any }> =>
      request<{ authenticated: boolean; session: any }>("/api/auth/session"),
    getProfile: (): Promise<any> => request<any>("/api/auth/me"),
    updateRole: (userId: string, role: string): Promise<any> =>
      request<any>("/api/auth/role", {
        method: "PATCH",
        body: JSON.stringify({ userId, role }),
      }),
  },
  settings: {
    getPublic: (): Promise<ISiteSettings> => request<ISiteSettings>("/api/settings/public"),
    getAll: (): Promise<Record<string, any>> => request<Record<string, any>>("/api/settings"),
    update: (key: string, value: Record<string, any>): Promise<any> =>
      request<any>("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ key, value }),
      }),
  },
  blogs: {
    list: (): Promise<IBlogPostItem[]> => request<IBlogPostItem[]>("/api/blogs"),
    getBySlug: (slug: string): Promise<IBlogPostItem | null> =>
      request<IBlogPostItem | null>(`/api/blogs/${encodeURIComponent(slug)}`),
    getAllAdmin: (): Promise<IBlogPostItem[]> => request<IBlogPostItem[]>("/api/blogs/all"),
    create: (data: Partial<IBlogPostItem>): Promise<IBlogPostItem> =>
      request<IBlogPostItem>("/api/blogs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<IBlogPostItem>): Promise<IBlogPostItem> =>
      request<IBlogPostItem>(`/api/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request<{ success: boolean }>(`/api/blogs/${id}`, { method: "DELETE" }),
  },
  services: {
    list: (): Promise<IServiceItem[]> => request<IServiceItem[]>("/api/services"),
    getAllAdmin: (): Promise<IServiceItem[]> => request<IServiceItem[]>("/api/services/all"),
    create: (data: Partial<IServiceItem>): Promise<IServiceItem> =>
      request<IServiceItem>("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<IServiceItem>): Promise<IServiceItem> =>
      request<IServiceItem>(`/api/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request<{ success: boolean }>(`/api/services/${id}`, { method: "DELETE" }),
  },
  experience: {
    list: (): Promise<IExperienceItem[]> => request<IExperienceItem[]>("/api/experience"),
    create: (data: Partial<IExperienceItem>): Promise<IExperienceItem> =>
      request<IExperienceItem>("/api/experience", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string | number, data: Partial<IExperienceItem>): Promise<IExperienceItem> =>
      request<IExperienceItem>(`/api/experience/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string | number): Promise<{ success: boolean }> =>
      request<{ success: boolean }>(`/api/experience/${id}`, { method: "DELETE" }),
  },
  testimonials: {
    list: (): Promise<ITestimonialItem[]> => request<ITestimonialItem[]>("/api/testimonials"),
    create: (data: Partial<ITestimonialItem>): Promise<ITestimonialItem> =>
      request<ITestimonialItem>("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ITestimonialItem>): Promise<ITestimonialItem> =>
      request<ITestimonialItem>(`/api/testimonials/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request<{ success: boolean }>(`/api/testimonials/${id}`, { method: "DELETE" }),
  },
  caseStudies: {
    list: (): Promise<ICaseStudyItem[]> => request<ICaseStudyItem[]>("/api/case-studies"),
    get: (id: string): Promise<ICaseStudyItem | null> => request<ICaseStudyItem | null>(`/api/case-studies/${id}`),
    related: (id: string, type?: string): Promise<ICaseStudyItem[]> => {
      const typeParam = type ? `/${encodeURIComponent(type)}` : "";
      return request<ICaseStudyItem[]>(`/api/case-studies/${id}${typeParam}/related`);
    },
    create: (data: any): Promise<any> =>
      request<any>("/api/case-studies", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any): Promise<any> =>
      request<any>(`/api/case-studies/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<{ success: boolean }> =>
      request<{ success: boolean }>(`/api/case-studies/${id}`, { method: "DELETE" }),
  },
  reports: {
    getOverview: (filter?: any): Promise<IReportOverview> => {
      const query = filter ? `?${new URLSearchParams(filter).toString()}` : "";
      return request<IReportOverview>(`/api/admin/reports/overview${query}`);
    },
  },
  auditLogs: {
    list: (query?: any): Promise<IAuditLogItem[]> => {
      const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
      return request<IAuditLogItem[]>(`/api/admin/audit-logs${queryString}`);
    },
  },
  contact: {
    submit: (payload: IContactPayload): Promise<IContactResponse> =>
      request<IContactResponse>("/api/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
  upload: {
    image: async (file: File): Promise<{ url: string; filename: string; size: number; mimetype: string }> => {
      const baseUrl = getApiBaseUrl();
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        let errorMsg = `Upload failed: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData?.message) {
            errorMsg = Array.isArray(errData.message) ? errData.message.join(", ") : errData.message;
          }
        } catch {
          // ignore
        }
        throw new ApiError(errorMsg, response.status);
      }

      const json = await response.json();
      if (json && typeof json === "object" && "success" in json && "data" in json) {
        return json.data;
      }
      return json;
    },
  },
};


