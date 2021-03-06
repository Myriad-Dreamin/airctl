export type functor<I> = (i: I) => I;
export type impureFunctor<P, I> = (i: P) => I;

// 函数组合算符
export const compose = <P, I>(g: functor<I>, f: impureFunctor<P, I>) => (i: P) => g(f(i));
