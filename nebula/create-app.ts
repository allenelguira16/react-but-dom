import { JSX } from "react";
import { mount, patch, render, renderObserver } from "./render";


export async function createApp($target: HTMLElement, vNode: JSX.Element) {
  // render($target, vNode);

  let $rootElement: HTMLElement | Text;

  renderObserver.watch(() => {
    const $newNode = render(vNode);

    if (!$rootElement) {
      $rootElement = mount($target, $newNode);
    } else {
      patch($rootElement as HTMLElement, $newNode as HTMLElement);
    }
  });
}

