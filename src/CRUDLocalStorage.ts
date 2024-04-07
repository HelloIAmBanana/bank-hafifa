export default class CRUDLocalStorage {
  static getAsyncData<T>(key: string): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : ([] as unknown as T));
      }, 3000);
    });
  }

  static setAsyncData(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve(value);
      }, 3000);
    });
  }

  static deleteAsyncData(key: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key);
        resolve();
      }, 3000);
    });
  }

  static async addItemToList<T>(key: string, newItem: T): Promise<void> {
    const items: T[] = await CRUDLocalStorage.getAsyncData<T[]>(key) || [];
    const updatedList: T[] = [...items, newItem];
    await CRUDLocalStorage.setAsyncData(key, updatedList);
  }

  static async updateItemInList<T extends { id: string }>(key: string, newItem: T): Promise<void> {
    const items: T[] = await CRUDLocalStorage.getAsyncData<T[]>(key) || [];
    const updatedItems = items.map((currentItem) => (currentItem.id === newItem.id ? newItem : currentItem));
    await CRUDLocalStorage.setAsyncData(key, updatedItems);
  }
}
