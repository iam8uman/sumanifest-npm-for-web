// Basic types
export type ID = string | number;

export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
}

// User related types
export interface User extends BaseEntity {
  username: string;
  email: string;
  isActive: boolean;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

// Form related types
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface FormState<T> {
  values: T;
  errors: FormErrors<T>;
  isSubmitting: boolean;
}

// Utility types
export type Nullable<T> = T | null;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type AsyncFunction<T = void> = () => Promise<T>;