const Page = require('./helpers/page');

let page;
const newPostBtn = `a.btn-floating[href="/blogs/new"]`;
const submitBtn = 'form button[type="submit"].teal.btn-flat';
const defaultTitle = 'My Title';
const defaultContent = 'My Content';

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.click(newPostBtn);
  });

  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('Add using valid inputs', () => {
    beforeEach(async () => {
      await page.type('.title input', defaultTitle);
      await page.type('.content input', defaultContent);
      await page.click(submitBtn);
    });

    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const cardTitle = await page.getContentsOf('.card-title');
      const cardContent = await page.getContentsOf('p');

      expect(cardTitle).toEqual(defaultTitle);
      expect(cardContent).toEqual(defaultContent);
    });
  });

  describe('And using invalid inputs', () => {
    beforeEach(async () => {
      await page.click(submitBtn);
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');
      const requireStmt = 'You must provide a value';

      expect(titleError).toEqual(requireStmt);
      expect(contentError).toEqual(requireStmt);
    });
  });
});
