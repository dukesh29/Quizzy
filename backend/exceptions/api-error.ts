interface ErrorResponse {
  code: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errors: ErrorResponse[];

  constructor(status: number, message: string, errors?: ErrorResponse[]) {
    super(message);
    this.status = status;
    this.errors = errors ? errors : [];
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован');
  }

  static BadRequest(message: string, errors: ErrorResponse[]) {
    return new ApiError(400, message, errors);
  }
}
