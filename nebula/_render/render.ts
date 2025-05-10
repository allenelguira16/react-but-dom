import { JSX } from "react";

import { applyStyle } from "../render/apply-style";
import { addEventListener } from "../render/event-registry";
import { effect, state } from "../signal";

const render = ($parent: HTMLElement, vNode: JSX.Element) => {
  if (typeof vNode === "string" || typeof vNode === "number") {
    $parent.appendChild(document.createTextNode(String(vNode)));
    return;
  }

  if (typeof vNode.type === "function") {
    renderComponent($parent, vNode);
    return;
  }

  renderNode($parent, vNode);
}

const renderComponent = ($parent: HTMLElement, vNode: JSX.Element) => {
  const component: Function = vNode.type;
  const props: Record<string, any> = vNode.props || {};

  effect(() => {
    const rendered = component(props);
    // console.log($parent, rendered);
    // patch($parent, rendered);
  });

  const rendered = component(props);
  render($parent, rendered);
}

export function renderNode($parent: HTMLElement, vNode: JSX.Element) {
  const tagName: keyof HTMLElementTagNameMap = vNode.type;
  const {
    children: vBaseChildrenNode = [],
    style: vStyle,
    ...props
  }: Record<string, any> = vNode.props;

  const $dom = document.createElement(tagName);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith("on")) {
      const type = key.slice(2).toLowerCase();

      addEventListener($dom, type, value);
    } else {
      $dom.setAttribute(key, value);
    }
  }

  if (vStyle && typeof vStyle === "object") {
    applyStyle($dom, vStyle);
  }

  const vChildrenNode = Array.isArray(vBaseChildrenNode)
    ? vBaseChildrenNode
    : [vBaseChildrenNode];

  // let $lastChild: Text | null = null;

  // const children: (HTMLElement | Text)[] = [];

  for (const vChildNode of vChildrenNode) {
    if (!vChildNode) continue;

    render($dom, vChildNode);
    // children.push();
  }

  // for (const child of mergeAdjacentTextNodes(children)) {
  //   $element.appendChild(child);
  // }

  // return $dom;
  $parent.appendChild($dom);
}
