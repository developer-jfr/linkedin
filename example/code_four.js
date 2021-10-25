const puppeteer = require("puppeteer");
const fs = require("fs");
const json = require("./../json/325g3-pvgry.json");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto("https://www.linkedin.com/", {
    timeout: 0,
    waitUntil: "load",
  });
  await page.type("#session_key", "degelspozitivik@gmail.com");
  await page.type("#session_password", "bakai987");
  await Promise.all([
    page.click(
      "#main-content > section.section.hero > div > div > form > button"
    ),
    page.waitForNavigation(),
  ]);
  const page2 = await browser.newPage();
  await page2.setDefaultNavigationTimeout(0);
  await page2.goto("http://faceebook.com");

  const urls = await page.evaluate(
    (element) => Array.from(element, (el) => el),
    json
  );

  for (let i = 0, total_urls = urls.length; i < total_urls; i++) {
    await page2.goto(urls[i], { waitUntil: "load" });

    const page_url = page2?.url()?.toString() || "";
    const info = await page2?.evaluate(() => {
      const imageLink =
        document
          .querySelector(
            "div.ember-view > div.relative > div.ph5.pt3 > div.org-top-card__primary-content.org-top-card-primary-content--zero-height-logo.org-top-card__primary-content--ia > div.org-top-card-primary-content__logo-container > img"
          )
          ?.getAttribute("src") || "";

      return imageLink;
    });

    let data = {
      linkedinUrl: page_url || "",
      linkedinProfileUrl: info || "",
    };

    console.log(data);
    fs.appendFile("./json/incubators.json", JSON.stringify(data), (err) =>
      err ? console.log(err) : null
    );
  }

  console.log("no more to click");
})();
