export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
    public path: string,
  ) {
    super(`API ${status} on ${path}: ${body}`);
    this.name = "ApiError";
  }
}
