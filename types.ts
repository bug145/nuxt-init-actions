import type { Store, ActionContext } from 'vuex';

export type ActionsArr = {
    [key: string | number]: ActionContext<any, any>;
}

export interface StoreExtended extends Store<any> {
    _actions?: ActionsArr;
}