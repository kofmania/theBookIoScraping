const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

const book = [];

const getPage = async (url) => {
  const html = await rp(url);

  let n = cheerio('a#next-page', html);
  const h2 = cheerio('#page_content > section > div > div > h2', html)[0];
  const h3 = cheerio('#sigil_toc_id_1', html)[0];
  const page = {
    url: url,
    txtc: cheerio('#page_content > section > div > div > h1 > span.txtc', html).text(),
    b1: cheerio('#page_content > section > div > div > h1 > span.bl', html).text(),
    green: cheerio('#page_content > section > div > div > h2 > span.dm.green', html).text(),
    gray: cheerio('#page_content > section > div > div > h2 > span.dm.gray', html).text(),
    h2: h2 && h2.lastChild.data.trim(),
    green4: cheerio('#sigil_toc_id_1 > span', html).text(),
    h3: h3 && h3.lastChild.data.trim(),
    nextURL: n && n.prop('href')
  }

  const h2 = cheerio('#page_content > section > div > div.box_purple > h2', html)[0];
  const page2 = {
    url: url,
    txtc: cheerio('#page_content > section > div > div > h1 > span.txtc.white', html).text(),
    b1: cheerio('#page_content > section > div > div > h1 > span.txtc.bl', html).text(),
    dmPurple: cheerio('#page_content > section > div > div.box_purple > h2 > span.dm.purple', html).text(),
    dmGray: cheerio('#page_content > section > div > div.box_purple > h2 > span.dm.gray', html).text(),
    h2: h2 && h2.lastChild.data.trim(),
    purple: cheerio('#page_content > section > div > p.txt2.dm > span', html).text()
  }

  book.push(page);

  return page.nextURL;
}

async function getBook(title, start) {
  const bookTitle = cheerio('#page_content > section > div > section.book-overview > h2', await rp(title)).text()

  let url = start;
  console.log('[start]');
  for (;;) {
    console.log('[url]', url);
    const nextUrl = await getPage(url);
    if (!nextUrl) break;
    else url = nextUrl;
  }
  console.log('[end]');

  fs.writeFileSync(`${!bookTitle && new Date().toUTCString}.json`, JSON.stringify(book, null, 2));
}

// getBook('https://thebook.io/006884', 'https://thebook.io/006884/ch01/');
getBook('https://thebook.io/006946/', 'https://thebook.io/006946/ch01/');