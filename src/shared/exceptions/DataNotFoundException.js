export default class DataNotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataNotFoundException';
  }
}
