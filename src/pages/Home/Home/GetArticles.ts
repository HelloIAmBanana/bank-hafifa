import { Article } from "../../../models/article";

export default async function getArticles(pagesAmount: number) {
  const articlesArray = [];

  for (let i = 1; i <= pagesAmount; i++) {
    const response = await fetch(
      `https://api.marketaux.com/v1/news/all?symbols=TSLA%2CAMZN%2CMSFT&filter_entities=true&limit=3&page=${i}&language=en,he&api_token=yRViEWPsrvESjsph62PVTHAp1hL4AgoXcv6NUBVF`
    );
    const articlesPageResults = await response.json();
    articlesArray.push(articlesPageResults["data"]);
  }

  const combinedArticlesArray: Article[] = articlesArray.flat().map((key) => ({
    id: key.uuid,
    title: key.title,
    description: key.description,
    url: key.url,
  }));

  sessionStorage.setItem("articles", JSON.stringify(combinedArticlesArray));

  return combinedArticlesArray;
}
