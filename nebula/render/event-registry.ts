type EventRecord = {
  type: string;
  listener: EventListenerOrEventListenerObject;
};

const eventRegistry = new WeakMap<Element, EventRecord[]>();

export function addEventListener(
  element: Element,
  type: string,
  listener: EventListenerOrEventListenerObject,
) {
  const events = eventRegistry.get(element) || [];

  events.push({ type, listener });

  eventRegistry.set(element, events);
  element.addEventListener(type, listener);
}

export function removeEventListeners(targetElement: Element) {
  for (const { type, listener } of getEventListener(targetElement)) {
    targetElement.removeEventListener(type, listener);
  }

  eventRegistry.delete(targetElement);
}

export function copyEventListeners(toElement: Element, fromElement: Element) {
  removeEventListeners(toElement);

  const events = getEventListener(fromElement);

  for (const { type, listener } of events) {
    addEventListener(toElement, type, listener);
  }
}

export function getEventListener(targetElement: Element) {
  return eventRegistry.get(targetElement) || [];
}
