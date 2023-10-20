export enum SessionItems {
  sessionToken = "sessionToken",
  walletId = "walletId"
}

const load = (item: SessionItems) => sessionStorage.getItem(item);

const save = (item: SessionItems, value: string) =>
  sessionStorage.setItem(item, value);

const clear = () => sessionStorage.clear();

export default {
  load,
  clear,
  save
};
