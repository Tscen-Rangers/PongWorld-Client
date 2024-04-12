// 원래의 console.error 함수를 저장합니다.
const originalConsoleError = console.error;

// console.error를 오버라이드하여 아무것도 하지 않는 함수로 만듭니다.
console.error = function () {};
console.warn = function () {};
