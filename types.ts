import type { Store, ActionContext } from 'vuex';

export interface StoreExtended extends Store<any> {
  _actions?: Record<string, ActionContext<any, any>>
}