import { AsyncLocalStorage } from "node:async_hooks";

export type TenantContext = {
  year: number | null;
  role: string | null;
};

const storage = new AsyncLocalStorage<TenantContext>();

export const tenantContext = {
  run: <T>(context: TenantContext, fn: () => Promise<T>): Promise<T> => {
    return storage.run(context, fn);
  },
  get: (): TenantContext | undefined => {
    return storage.getStore();
  },
};
