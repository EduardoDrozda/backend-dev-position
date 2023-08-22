export default class DataAlreadyExistsException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataAlreadyExistsException';
  }
}
