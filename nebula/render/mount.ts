export function mount($target: HTMLElement | Text, $node: HTMLElement | Text) {
  if ($target instanceof HTMLElement)
    $target.replaceChildren($node);

  return $node;
}
