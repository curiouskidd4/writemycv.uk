import mixpanel from "mixpanel-browser";

const logEvent = (eventName: string, data: any) => {
  mixpanel.track(eventName, data);
};

export { logEvent };