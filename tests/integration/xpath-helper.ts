export function xPathToFindAnyElementWithText(text: string): string {
  return xPathToFindElementOfTypeXWithText("*", text);
}

export function xPathToFindElementOfTypeXWithText(elementType: HTMLElement | string, text: string): string {
  return `//${getElementPrefix(elementType)}[text()[contains(., '${text}')]]`;
}


export function xPathToFindAnyElementWithExactText(text: string): string {
  return xPathToFindElementOfTypeXWithExactText("*", text);
}

export function xPathToFindElementOfTypeXWithExactText(elementType: HTMLElement | string, text: string): string {
  return `//${getElementPrefix(elementType)}[text()[.='${text}']]`;
}

export function xPathToFindAnyElementWithTitle(title: string): string {
  return xPathToFindElementOfTypeXWithTitle("*", title);
}

export function xPathToFindElementOfTypeXWithTitle(elementType: HTMLElement | string, title: string): string {
  return `//${getElementPrefix(elementType)}[@title='${title}']`;
}

export function xPathToFindSvgWithTitle(title: string): string {
  return `//*[local-name()='svg']/*[local-name()='title' and text()[contains(.,'${title}')]]/..`;
}

function getElementPrefix(elementType: HTMLElement | string) {
  return typeof elementType === 'string' ? elementType : elementType.tagName
}