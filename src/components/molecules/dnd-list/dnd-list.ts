import {
  Component,
  startComponents,
  stopComponents,
  EventListener,
  GondelBaseComponent
} from "@gondel/core";

import { DOMUtil } from "../../../assets/js/DOMUtil";
import Service from "../../../assets/js/Service";
import { ListItem } from "../list-item/list-item";
import "./dnd-list.scss";

var listTpl = require("./dnd-list.hbs");

@Component("DnDList")
export class DnDList extends GondelBaseComponent {
  _category: string;
  public get category(): string {
    return this._category;
  }

  _elements: {
    input: HTMLInputElement;
    list: Element;
  };

  constructor(ctx: HTMLElement) {
    super();

    this._category = ctx.dataset.category as string;
    this._elements = {
      list: ctx.querySelector(".js-items-list") as Element,
      input: ctx.querySelector(".js-item-label-input") as HTMLInputElement
    };
  }

  createItem(title: String) {
    const newListItem = ListItem.render(title);
    newListItem.setAttribute("draggable", "true");
    this._elements.list.appendChild(newListItem);
    startComponents(newListItem).then((components) => {
      components.forEach((c) => {
        const li = c as ListItem;
        Service.saveItem({
          id: li._id,
          title: li.getTitle(),
          state: this._category
        })
      });
    });
  }

  appendItem(li: ListItem, save=true) {
    this._elements.list.appendChild(li._ctx);
    
    if (!save) {
      return;
    }

    Service.saveItem({
      id: li._id,
      title: li.getTitle(),
      state: this._category
    });
  }

  removeItem(li: ListItem, save=true) {
    stopComponents(li._ctx);
    this._elements.list.removeChild(li._ctx);

    if (!save) {
      return;
    }

    Service.deleteItem({
      id: li._id,
      state: this._category,
      title: li.getTitle()
    })
  }

  containsItem(li: ListItem): boolean {
    return this._ctx.contains(li._ctx);
  }

  @EventListener("click", ".js-add-item-button")
  _addItem() {
    this.createItem(this._elements.input.value);
  }

  @EventListener("dragover")
  _allowDrop(e) {
    e.preventDefault();
  }

  @EventListener("dragstart", ".js-list-item")
  _dragItem(e) {
    e.dataTransfer.setData("item", e.target.dataset.itemId);
  }

  @EventListener("drop")
  _dropItem(e) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("item");
    const li = DOMUtil.findGlobalListItem(itemId) as ListItem;
    if (this.containsItem(li)) {
      return;
    }
    this.appendItem(li);
  }

  @EventListener("gItemCancelled")
  _removeItem(e) {
    this.removeItem(e.data.component);
  }

  public static render(category: String): Element | null {
    const htmlString = listTpl({
      category: category
    });
    return DOMUtil.createElementFromHTML(htmlString);
  }
}
