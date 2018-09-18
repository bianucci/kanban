import {
  getComponentByDomNode
} from "@gondel/core";

export class DOMUtil {
  public static createElementFromHTML(htmlString): HTMLElement {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstElementChild as HTMLElement;
  }

  public static findGlobalListItem(id) {
    const node = document.querySelector(
      `li[data-item-id="${id}"]`
    ) as HTMLElement;
    if (!node) {
      return;
    }
    return getComponentByDomNode(node);
  }
}
