export const onBrowserUnload = (e: any) => {
  e.preventDefault();
  // eslint-disable-next-line functional/immutable-data
  return (e.returnValue = "");
};

export const onBrowserBackEvent = (e: any) => {
  e.preventDefault();
  window.history.pushState(null, "", window.location.pathname);
};

export const clearNavigationEvents = () => {
  window.removeEventListener("popstate", onBrowserBackEvent);
  window.removeEventListener("beforeunload", onBrowserUnload);
};
