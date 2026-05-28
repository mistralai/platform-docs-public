export class InternalError extends Error {
  constructor(originalMessage: string) {
    super(
      `Internal Error: ${originalMessage}. This is a bug, please report it to Speakeasy`
    );
    this.name = 'InternalError';
  }
}
