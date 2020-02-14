const puppeteer = require('puppeteer');

const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    const logoutBtn = `a[href='/auth/logout']`;
    await this.page.waitFor(logoutBtn);
  }

  async getContentsOf(selector) {
    if (!selector) return null;

    return this.page.$eval(selector, el => el.innerHTML);
  }

  get({ path }) {
    return this.page.evaluate(async _path => {
      const res = await fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return res.json();
    }, path);
  }

  post(meta) {
    if (typeof meta !== 'object') return null;

    return this.page.evaluate(async ({ path, data }) => {
      const res = await fetch(path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      return res.json();
    }, meta);
  }

  execRequests(actions) {
    if (typeof actions !== 'object' || !actions.length) return null;

    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method]({ path, data });
      })
    );
  }
}

module.exports = Page;
