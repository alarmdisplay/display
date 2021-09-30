import { HookContext } from '@feathersjs/feathers';
import { getItems, replaceItems } from 'feathers-hooks-common';

export function unserializeJson (property: string) {
  return (context: HookContext): HookContext => {
    const items = getItems(context);
    if (Array.isArray(items)) {
      items.forEach(item => {
        if (typeof item[property] === 'string') {
          item[property] = item[property].length === 0 ? null : JSON.parse(item[property]);
        }
      });
    } else {
      if (typeof items[property] === 'string') {
        items[property] = items[property].length === 0 ? null : JSON.parse(items[property]);
      }
    }

    replaceItems(context, items);
    return context;
  };
}
