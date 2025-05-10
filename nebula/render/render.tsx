import { JSX } from "react";
import { setCurrentContext } from "../state";
import { applyStyle } from "./apply-style";
import { addEventListener } from "./event-registry";

type JSXElementWithStore = JSX.Element & {
  _store: Record<string, any>;
};

// TODO: Update state strategy
function renderComponent(vNode: JSX.Element) {
  const component: Function = vNode.type;
  const props: Record<string, any> = vNode.props || {};

  const store = (vNode as JSXElementWithStore)._store;

  if (!store.context) {
    store.context = { hookIndex: 0, hooks: [], effects: [] };
  }

  setCurrentContext(store.context);
  store.context.effects = [];

  const rendered = component(props);
  const $element = render(rendered);

  store.context.effects.forEach((effect: () => void) => effect());

  return $element;
}

function renderNode(vNode: JSX.Element) {
  const tagName: keyof HTMLElementTagNameMap = vNode.type;
  const {
    children: vBaseChildrenNode = [],
    style: vStyle,
    ...props
  }: Record<string, any> = vNode.props;

  const $dom = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (!key.startsWith("on")) {
      $dom.setAttribute(key, value);
      continue;
    }

    const type = key.slice(2).toLowerCase();

    addEventListener($dom, type, value);
  }

  if (vStyle && typeof vStyle === "object") {
    applyStyle($dom, vStyle);
  }

  const vChildrenNode = Array.isArray(vBaseChildrenNode)
    ? vBaseChildrenNode
    : [vBaseChildrenNode];

  let $lastChild: Text | null = null;

  for (const vChildNode of vChildrenNode) {
    if (vChildNode === false) continue;

    const $child = render(vChildNode);

    if ($child instanceof Text && $lastChild) {
      $lastChild.textContent = `${$lastChild.textContent}${$child.textContent}`;
      continue;
    }

    $dom.appendChild($child);
    $lastChild = $child instanceof Text ? $child : null;
  }

  return $dom;
}

export function render(vNode: JSX.Element | string): HTMLElement | Text {
  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(String(vNode));
  }

  if (typeof vNode.type === "function") {
    return renderComponent(vNode);
  }

  return renderNode(vNode);
}
