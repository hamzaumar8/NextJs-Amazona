import NextLink from "next/link";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import useStyles from "../../utils/styles";
import Image from "next/image";
import Product from "../../models/Product";
import db from "../../utils/db";
import axios from "axios";
import { Store } from "../../utils/store";
import { useRouter } from "next/router";

export default function ProductScreen({ product }) {
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const classes = useStyles();
  console.log(product);
  //   const { slug } = router.query;
  //   fetch the product form data's and find the slug of the product
  //   const product = data.products.find((a) => a.slug === slug);
  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/product/${product._id}`);
    if (data.countInstock <= 0) {
      window.alert("Sorry. product is out of stock.");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
    router.push("/cart");
  };
  return (
    <div>
      <Layout title={product.name} description={product.description}>
        <div className={classes.section}>
          <NextLink href="/" passHref>
            <Link>Back to product</Link>
          </NextLink>
        </div>
        <Grid container spacing={1}>
          <Grid item md={6} xs={12}>
            <Image
              src={product.image}
              alt={product.title}
              width={640}
              height={640}
              layout="responsive"
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  {product.name}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography>Category: {product.category}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Brand: {product.brand}</Typography>
              </ListItem>
              <ListItem>
                <Typography>
                  Rating: {product.rating} stars ({product.numReviews} reviews)
                </Typography>
              </ListItem>
              <ListItem>
                Description: <Typography>{product.description}</Typography>
              </ListItem>
            </List>
          </Grid>
          <Grid item md={3} sx={13}>
            <Card>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography>Price</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography>${product.price}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography>Status</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography>
                        {product.countInstock > 0 ? "In Stock" : "Unavailable"}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={addToCartHandler}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Add to Cart
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }, "-reviews").lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}
