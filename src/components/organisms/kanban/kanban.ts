import {
  Component,
  startComponents,
  EventListener,
  GondelBaseComponent,
  findComponents
} from "@gondel/core";

import { DOMUtil } from "../../../assets/js/DOMUtil";
import { DnDList } from "../../molecules/dnd-list/dnd-list";
import { ListItem } from "../../molecules/list-item/list-item";

var columnTpl = require("./column.hbs");

import "./kanban.scss";

@Component("Kanban")
export class Kanban extends GondelBaseComponent {
  _orderedCategories: Array<string>;

  start() {
    const p = this._ctx.dataset.process;
    this._orderedCategories = p ? p.split(",") : [];
    this._createColumnsForCategories(this._orderedCategories);
    this._enableColaboration();
  }

  _createColumnsForCategories(categories: Array<string>) {
    categories.forEach(category => {
      const column = this._createColumnForCategory(category);
      this._ctx.appendChild(column);
      startComponents(column);
    });
  }

  @EventListener("gItemConfirmed")
  _itemConfirmed(e) {
    const li = e.data.component as ListItem;
    const list = this._getContainingListForItem(li);
    if (!list) {
      return;
    }
    const targetCategory = this._getNextStepInProcess(list.category, 1);
    const l = this._getListForCategory(targetCategory);
    if (!l) {
      return;
    }
    l.appendItem(li);
  }

  _getContainingListForItem(li): DnDList | undefined {
    return this._findLists().find(list => list.containsItem(li));
  }

  _findLists(): Array<DnDList> {
    return findComponents(this._ctx, "DnDList") as Array<DnDList>;
  }

  _getListForCategory(c): DnDList | undefined {
    return (findComponents(this._ctx, "DnDList") as Array<DnDList>).find(
      m => m.category === c
    );
  }

  _getNextStepInProcess(category: string, direction: number): string {
    let idx = this._orderedCategories.indexOf(category);
    idx += direction;
    if (idx < 0 || idx >= this._orderedCategories.length) {
      // out of bounds, abort transition since not allowed
      return category;
    }
    return this._orderedCategories[idx];
  }

  _createColumnForCategory(c: string): Element {
    const dndList = DnDList.render(c);
    const column = DOMUtil.createElementFromHTML(columnTpl());
    column.appendChild(dndList as Node);
    return column;
  }

  _enableColaboration() {
    var source = new EventSource("http://localhost:8090/stock/transaction");
    source.onmessage = function(event) {
      console.log("update", event);
    };
  }
}
