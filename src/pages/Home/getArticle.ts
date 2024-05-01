import { Article } from "../../models/article";

async function fetchArticlesPage(): Promise<Article[]> {
  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=pub_43254c4d3ab7fa32f2766f295c7fcc078545e&country=il&category=business&language=he,en`
  );
  if (!response.ok) {
    return [
      {
        id: "ERROR",
        title: "There was an error loading the articles!",
        description: "Please try again later.",
        url: "#",
        imageURL:
          "https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_06/2746941/190208-stock-money-fanned-out-ew-317p.jpg",
      },
    ];
  }
  const responseJSON = await response.json();

  return responseJSON["results"].map((article: any) => ({
    id: article.article_id,
    title: article.title,
    description: article.description,
    url: article.link,
    imageURL: article.image_url,
  }));
}

export default async function getArticles(): Promise<Article[]> {
  const cachedArticles = sessionStorage.getItem("articles");

  console.log(cachedArticles);

  if (cachedArticles !== null) return JSON.parse(cachedArticles);

  const articles = await Promise.all(await fetchArticlesPage());

  const combinedArticles = articles.flat();

  sessionStorage.setItem("articles", JSON.stringify(combinedArticles));

  return combinedArticles;
}
