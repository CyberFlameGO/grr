import {OnDestroy} from '@angular/core';
import {Observable, Subject} from 'rxjs';

/** ngOnDestroy callback that emits and completes an Observable. */
export interface OnDestroyObserver {
  (): void;
  /**
   * Observable that emits and completes when ngOnDestroy is called.
   */
  readonly triggered$: Observable<void>;
}

/**
 * Wraps an ngOnDestroy callback that emits and completes its `triggered$`
 * property when called.
 *
 * To use, add `implements OnDestroy` to your Component, Directive, or service.
 * Then, add `readonly ngOnDestroy = observeOnDestroy(this);`. You can now use
 * it like: `myObservable.pipe(takeUntil(this.ngOnDestroy.triggered$))`.
 *
 * @param ngOnDestroy an optional callback
 * @return ngOnDestroy function with `triggered$` property.
 */
export function observeOnDestroy(
    component: OnDestroy, callback?: () => void): OnDestroyObserver {
  const subject = new Subject<void>();
  const handler = function ngOnDestroy() {
    subject.next();
    subject.complete();
    callback?.();
  };
  handler.triggered$ = subject.asObservable();

  // Angular does not invoke ngOnDestroy, if it merely a property of the class.
  // Assign the function to the class' prototype to cause correct invocation.
  // As of January 2022, there is no way for Decorators to affect the type
  // signature of the returned type, which is why a factory function is the only
  // possible solution to allow ngOnDestroy to have a `triggered$` property.
  Object.getPrototypeOf(component).ngOnDestroy = handler;

  return handler;
}

/** Returns a Promise that resolves to an Array of all emitted values. */
export function allValuesFrom<T>(obs: Observable<T>):
    Promise<ReadonlyArray<T>> {
  return new Promise((resolve, reject) => {
    const data: T[] = [];
    obs.subscribe({
      next: (value) => {
        data.push(value);
      },
      complete: () => {
        resolve(data);
      },
      error: (e) => {
        reject(e);
      },
    });
  });
}
