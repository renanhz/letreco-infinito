export default class UIHandler {
  static addClassToChildren(children, className) {
    Array.from(children).forEach(element => {
      addClassToElement(element, className);
    });
  }
  
  static addClassToElement(element, className) {
    element.classList.add(className);
  }

  static removeClassFromChildren(children, className) { 
    Array.from(children).forEach((element) => {
      removeClassFromElement(element, className);
    });
  }
  
  static removeClassFromElement(element, className) {
    element.classList.remove(className);
  }
}
