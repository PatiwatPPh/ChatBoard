import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShoppingListService } from './shopping-list.service';
import { Observable } from 'rxjs';
import { ShoppingListQuery } from './state/shopping-list.query';
import { ID } from '@datorama/akita';
import { ShoppingListItem } from './state/shopping-list.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  items$: Observable<ShoppingListItem[]>;
  private disposeConnection: VoidFunction;
  name;
  constructor(private shoppingList: ShoppingListService, private query: ShoppingListQuery) {
  }

  ngOnInit() {
    this.items$ = this.query.selectAll();
    this.disposeConnection = this.shoppingList.connect();
    
    console.log(this.items$)
  }

  inputName(val : string){
    this.name = val;
  }

  add(input: HTMLInputElement) {
    this.shoppingList.add(input.value,this.name);
    input.value = '';
  }

  remove(id: ID) {
    this.shoppingList.remove(id);
  }

  toggle(id: ID) {
    this.shoppingList.toggleCompleted(id);
  }

  track(_, item) {
    return item.title;
  }

  ngOnDestroy() {
    this.disposeConnection();
  }

}
