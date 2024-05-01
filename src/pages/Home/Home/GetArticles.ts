export default async function getArticles() {
  const articles = sessionStorage.getItem("articles");

  if (articles !== null) {
    const articlesObject: any[] = JSON.parse(articles!);

  return articlesObject.map((key) => ({
    title: key.title,
    description: key.description,
    url: key.url,
  }));
  };

  const responseFirstPage = await fetch(
    "https://api.marketaux.com/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&limit=3&page=1&language=en,he&api_token=yRViEWPsrvESjsph62PVTHAp1hL4AgoXcv6NUBVF"
  );
  const articlesFirstPage = await responseFirstPage.json();

  const responseSecondPage = await fetch(
    "https://api.marketaux.com/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&limit=3&page=2&language=en,he&api_token=yRViEWPsrvESjsph62PVTHAp1hL4AgoXcv6NUBVF"
  );
  const articlesSecondPage = await responseSecondPage.json();

  const combinedArticles =
    JSON.stringify(articlesFirstPage["data"]).slice(0, -1) + "," + JSON.stringify(articlesSecondPage["data"]).slice(1);

  sessionStorage.setItem("articles", combinedArticles);
  
  const articlesObject: any[] = JSON.parse(combinedArticles);

  return articlesObject.map((key) => ({
    title: key.title,
    description: key.description,
    url: key.url,
  }));
}
