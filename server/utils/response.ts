export const sendSuccess = <T>(
  data: T,
  options?: {
    message?: string
    meta?: ApiResponse<T>['meta']
  }
): ApiResponse<T> => ({
  success: true,
  data,
  message: options?.message,
  meta: options?.meta,
})
