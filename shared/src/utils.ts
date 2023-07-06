/**
 * Createas a promise that takes the a amount of miliseconds to reseolve
 * @param delay Number of milliseconds to await
 * @returns A promise that resolve in delay milliseconds
 */
export function delay(delay: number = 0): Promise<any> {
  return new Promise(res => setTimeout(res, delay));
}
