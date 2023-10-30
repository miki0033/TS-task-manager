export default class DOMElement {
  p: any = null;
  children: HTMLElement[] = [];

  public getNode() {
    return this.p;
  }
  public append(p: HTMLElement) {
    this.p.appendChild(p);
    this.children.push(p);
  }
}
