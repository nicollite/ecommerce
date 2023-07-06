export interface MockValidatorOptions {
  async?: boolean;
  error?: any;
}

/**
 * Creates a test validator for test
 * @param options Test validator options
 * @returns A jest Mock function
 */
export function createMockValidator(options: MockValidatorOptions = {}): jest.Mock<any> {
  const { error = null, async } = options;
  const value = async ? new Promise(res => res(error)) : error;
  return jest.fn(() => value);
}

/** A validator function that always return a invalid validator error */
export function alwaysInvalidValidator(
  error: any = { error: "error" },
  async?: boolean,
): jest.Mock<any> {
  return createMockValidator({ async, error });
}

/** A validator function that always return a valid response */
export function alwaysValidValidator(async?: boolean): jest.Mock<any> {
  return createMockValidator({ async });
}
