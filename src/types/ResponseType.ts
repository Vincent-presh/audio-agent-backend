export interface ApiResponse<T> {
  success: boolean;
  data?: any;
  message?: string;
}
