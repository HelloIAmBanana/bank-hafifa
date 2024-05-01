import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

interface NewsBoxProps {
  articleLink: string;
  articleTitle: string;
  articleDescription: string;
}

const NewsBox: React.FC<NewsBoxProps> = ({ articleDescription, articleLink, articleTitle }) => {

  return (
    <Card sx={{ maxWidth: 345, mb: 5, borderRadius: 5,width:345 }} elevation={12}>
      <CardMedia
        component="img"
        alt="article image"
        height="140"
        image="https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_06/2746941/190208-stock-money-fanned-out-ew-317p.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" fontFamily={"Poppins"} fontSize={16}>
          {articleTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" fontFamily={"Poppins"}>
          {articleDescription}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" color="primary">
          <NavLink
            to={articleLink}
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
