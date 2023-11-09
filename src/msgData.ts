export class msgData {
  static keys: string[] = [];
  static values: any[] = [];
  constructor() {}

  public static storeMsg(key: string, value: any) {
    let flag = true;
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] == key) {
        this.values[i] = value;
        flag = false;
      }
    }
    if (flag) {
      this.keys.push(key);
      this.values.push(value);
    }
  }

  public static takeMsg(key: string): any {
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] == key) {
        return msgData.values[i];
      }
    }
    return undefined;
  }
}
