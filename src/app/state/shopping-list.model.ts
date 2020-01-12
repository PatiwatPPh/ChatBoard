import { guid, ID } from '@datorama/akita';

export interface ShoppingListItem {
  id: ID;
  title: string;
  completed: boolean;
  name : string;
}

export function createShoppingListItem({ title,name }: Partial<ShoppingListItem>) {
  return {
    id: guid(),
    title,
    completed: false,
    name : name,
  } as ShoppingListItem;
}
