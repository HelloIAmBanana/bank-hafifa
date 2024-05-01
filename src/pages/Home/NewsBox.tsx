import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Article } from "../../models/article";

interface NewsBoxProps {
  article: Article;
}

const NewsBox: React.FC<NewsBoxProps> = ({ article }) => {

  return (
    <Card sx={{ maxWidth: 345, mb: 5, borderRadius: 5,width:345 }} elevation={12}>
      <CardMedia
        component="img"
        alt="article image"
        height="140"
        image={article.imageURL}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" fontFamily={"Poppins"} fontSize={16}>
          {article.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontFamily={"Poppins"}>
          {article.description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" color="primary">
          <NavLink
            to={article.url}
            style={{
              textDecoration: "none",
              fontFamily: "Poppins",
              color: "Highlight",
            }}
          >
            <Typography>Read More</Typography>
          </NavLink>
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewsBox;
