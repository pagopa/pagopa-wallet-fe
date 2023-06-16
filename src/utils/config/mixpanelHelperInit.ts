import { init, track, Mixpanel } from "mixpanel-browser";
import { getConfigOrThrow } from "./config";

const ENV = getConfigOrThrow().WALLET_ENV;

export const mixpanelInit = function (): void {
  if (ENV === "DEV") {
    // eslint-disable-next-line no-console
    console.log("Mixpanel events mock on console log.");
  } else {
    init("c3db8f517102d7a7ebd670c9da3e05c4", {
      api_host: "https://api-eu.mixpanel.com",
      persistence: "localStorage",
      ip: false,
      property_blacklist: ["$current_url", "$initial_referrer", "$referrer"],
      loaded(mixpanel: Mixpanel) {
        // this is useful to obtain a new distinct_id every session
        if (sessionStorage.getItem("rptId") === null) {
          mixpanel.reset();
        }
      },
    });
  }
};

export const mixpanel = {
  track(event_name: string, properties?: any): void {
    if (ENV === "DEV") {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    } else {
      try {
        if (ENV === "UAT") {
          track(event_name, { ...properties, ...{ environment: "UAT" } });
        } else {
          track(event_name, properties);
        }
      } catch (_) {
        // eslint-disable-next-line no-console
        console.log(event_name, properties);
      }
    }
  },
};
