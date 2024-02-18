export default class {
  constructor(params) {
    // 여기서 params를 정의해주면 다른 자식 class에서도 this.params를 사용 할 수 있음
    // params 말고 모든 문자열도 가능
    // ex) this.huipakr = "hello huipark"
    this.params = params;
  }

  setTitle(title) {
    document.title = title;
  }

  async getHtml() {
    return '';
  }

  afterRender() {}
}
