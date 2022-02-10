// Type definitions for feathers-shallow-populate
declare module 'feathers-shallow-populate' {
  import { Hook, HookContext, Params } from '@feathersjs/feathers';

  interface Include {
    service: string
    nameAs: string
    keyHere?: string
    keyThere?: string
    asArray?: boolean
    requestPerItem?: boolean
    catchOnError?: boolean
    params?: Params | typeof ParamsFunction
  }

  function ParamsFunction(params?: Params, context?: HookContext): Params | Promise<Params> | undefined;

  export interface PopulateOptions {
    include: (Include | Include[])
    catchOnError?: boolean
  }

  export function shallowPopulate(options: PopulateOptions): Hook
}
