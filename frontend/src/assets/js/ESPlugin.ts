// Plugin code: eventsource-plugin.ts
/**
 * This function creates a custom gondel event
 */

let EVENT_SOURCE = 'EventSource'
let id = 0;

import { addGondelPluginEventListener, GondelComponent, getComponentByDomNode } from '@gondel/core'
import { INamespacedEventHandlerRegistry } from "@gondel/core/dist/GondelEventRegistry";

/**
 * This function returns all components for the given eventRegistry which can be found in the dom.
 */
function getComponentsInEventRegistry(
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
): GondelComponent[] {
  const selector = Object.keys(eventRegistry)
    .map(componentName => `[data-${namespace}-name="${componentName}"]`)
    .join(",");
  if (!selector) {
    return [];
  }
  const componentElements = document.documentElement.querySelectorAll(selector);
  const components: GondelComponent[] = [];
  for (let i = 0; i < componentElements.length; i++) {
    const component = getComponentByDomNode(componentElements[i], namespace);
    if (component) {
      components.push(component);
    }
  }
  return components;
}

/**
 * This function fire's a custom gondel event to all registered components
 */
function fireEventSourceEvent(
  eventSourceEventName: string,
  type: 'text' | 'json',
  event: MessageEvent,
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string
) {
  const components = getComponentsInEventRegistry(eventRegistry, namespace);
  const handlerResults: Array<() => void | undefined> = [];
  const eventData = (type === 'json') ? JSON.parse(event.data) : event.data;
  components.forEach(component => {
    Object.keys(eventRegistry[component._componentName]).forEach(selector => {
      if (selector === "" || eventSourceEventName === selector) {
        eventRegistry[component._componentName][selector].forEach(handlerOption => {
          handlerResults.push(
            (component as any)[handlerOption.handlerName].call(component, { eventData: eventData, eventSourceEventName })
          );
        });
      }
    });
  });
  handlerResults.forEach(handlerResults => () => {
    if (typeof handlerResults === "function") {
      handlerResults();
    }
  });
}


function setUpEventSourceListener( eventSource: EventSource,
  type: 'text' | 'json',
  eventRegistry: INamespacedEventHandlerRegistry,
  namespace: string, 
) {
  eventSource.onmessage = (event) => {
    fireEventSourceEvent(event.type, type, event, eventRegistry, namespace);
  };
}

export function initEventSource(eventSource: EventSource, type: 'text' | 'json' = 'text'): string {

  const uniqueEventName = EVENT_SOURCE + (id++);

  addGondelPluginEventListener("registerEvent", function addViewportChangeEvent(
    isNativeEvent,
    { eventName, namespace, eventRegistry },
    resolve
  ) {
    // Ignore all events but the viewportChange event
    if (eventName !== uniqueEventName) {
      resolve(isNativeEvent);
      return;
    }
    setUpEventSourceListener(eventSource, type, eventRegistry, namespace);

    // Tell the event system that it should not listen for the event:
    resolve(false);
  });

  return uniqueEventName;
}