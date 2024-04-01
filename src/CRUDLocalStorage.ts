class CRUDLocalStorage {
  static getAsyncData<T>(key: string): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = localStorage.getItem(key);
        resolve(data ? JSON.parse(data) : ([] as unknown as T));
      }, 1000);
    });
  }

  static setAsyncData(key: string, value: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(key, JSON.stringify(value));
        resolve(value);
      }, 1000);
    });
  }

  static deleteAsyncData(key: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(key);
        resolve();
      }, 1000);
    });
  }

  static async addItemToList<T>(
    key: string,
    newItem: T
  ): Promise<void> {
    const items: T[] = (await CRUDLocalStorage.getAsyncData<T[]>(key)) || [];
    const updatedItems: T[] = [...items, newItem];
    await CRUDLocalStorage.setAsyncData(key, updatedItems);
  }
}
export default CRUDLocalStorage;
