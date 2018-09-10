export class DOMUtil {
  public static createElementFromHTML(htmlString): HTMLElement {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstElementChild as HTMLElement;
  }
}
