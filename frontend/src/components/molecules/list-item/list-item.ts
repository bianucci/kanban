import {
  Component,
  EventListener,
  GondelBaseComponent,
  triggerPublicEvent
} from "@gondel/core";

import { DOMUtil } from "../../../assets/js/DOMUtil";

import "./list-item.scss";

var listItemTpl = require("./list-item.hbs");
const uuid = require("uuid/v4");

@Component("ListItem")
export class ListItem extends GondelBaseComponent {
  _id: string;
  _editableTitleEl: HTMLElement;

  constructor(ctx: HTMLElement) {
    super();
    this._id = ctx.dataset.itemId = uuid();
    this._editableTitleEl = ctx.querySelector(
      ".js-editable-text"
    ) as HTMLElement;
  }

  @EventListener("click", ".js-set-item-cancelled")
  _clickCancel(e) {
    triggerPublicEvent("gItemCancelled", this);
  }

  @EventListener("click", ".js-set-item-confirmed")
  _clickSuccess(e) {
    triggerPublicEvent("gItemConfirmed", this);
  }

  public static render(title): Element {
    return DOMUtil.createElementFromHTML(
      listItemTpl({ title: title })
    ) as Element;
  }

  get id(): string {
    return this._id;
  }

  setId(id) {
    this._id = this._ctx.dataset.itemId = id;
  } 

  getTitle(): string {
    const c = this._editableTitleEl.textContent;
    return c ? c.trim() : "";
  }
}
