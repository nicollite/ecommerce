import { Observer } from "rxjs";

export interface FakeObservable {
  pipe: jest.Mock;
  subscribe: jest.Mock & {
    getNext(n?: number): (...args: any[]) => any;
  };
  toPromise: jest.Mock;
}

export interface FakeSubject extends FakeObservable {
  next: jest.Mock;
  error: jest.Mock;
  complete: jest.Mock;
}

export interface CreateFakeObsOptions {
  promiseResolveValue?: any;
}

/** Creates a fake observable */
export function createFakeObservable<T = any>(options: CreateFakeObsOptions = {}): FakeObservable {
  const { promiseResolveValue } = options;

  const fakeObs: FakeObservable = {
    pipe: jest.fn(),
    subscribe: jest.fn() as any,
    toPromise: jest.fn(),
  };

  fakeObs.pipe.mockReturnValue(fakeObs);

  fakeObs.subscribe.getNext = (callNumber: number = 0) => {
    const observerOrNext: Partial<Observer<T>> | ((value: T) => void) =
      fakeObs.subscribe.mock.calls[callNumber][0];

    if (typeof observerOrNext === "function") return observerOrNext;
    return observerOrNext.next;
  };

  if (promiseResolveValue) fakeObs.toPromise.mockResolvedValue(promiseResolveValue);

  return fakeObs;
}

/** Creates a fake subject */
export function createFakeSubject(options: CreateFakeObsOptions = {}): FakeSubject {
  const fakeSub: FakeSubject = createFakeObservable(options) as any;
  fakeSub.next = jest.fn();
  fakeSub.error = jest.fn();
  fakeSub.complete = jest.fn();
  return fakeSub;
}
