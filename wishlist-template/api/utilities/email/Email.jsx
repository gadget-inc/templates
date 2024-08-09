import {
  Button,
  Container,
  Html,
  Section,
  Column,
  Text,
  Row,
  Img,
} from "@react-email/components";
import React from "react";

const placeholderImage = "https://picsum.photos/100";

export default ({ name, onSale, removed, count }) => {
  return (
    <Html>
      <Text>Hello {name},</Text>
      <Container>
        {!!onSale?.length && (
          <Section>
            <Text>Some of the products on your wishlist are on sale!</Text>
            {onSale?.map(
              ({
                id,
                title,
                productTitle,
                price,
                compareAtPrice,
                image: { source, alt },
              }) => (
                <WishlistItemCard
                  key={id}
                  {...{
                    title,
                    productTitle,
                    price,
                    compareAtPrice,
                    source,
                    alt,
                  }}
                />
              )
            )}
          </Section>
        )}
        {!!removed?.length && (
          <Section>
            <Text>
              Unfortunately, the following products are no longer available.
            </Text>
            {removed?.map(({ id, title, image: { source, alt } }) => (
              <WishlistItemCard key={id} {...{ title, source, alt }} />
            ))}
          </Section>
        )}
        {!!!count && (
          <Section>
            <Text>
              There haven't been any recent changes to the items on your
              wishlist. While we keep an eye out for any updates to your desired
              products, why not explore our shop for new arrivals and
              bestsellers? You might discover something you love!
            </Text>
          </Section>
        )}
      </Container>
    </Html>
  );
};

function WishlistItemCard({
  title,
  productTitle,
  source,
  alt,
  price,
  compareAtPrice,
}) {
  return (
    <Row
      style={{
        display: "flex",
        justifyContent: "spaceBetween",
        padding: "20px",
        border: "1px solid #e5e5e5",
        borderRadius: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
    >
      <Column>
        <Img
          src={source || placeholderImage}
          alt={alt || "placeholder image"}
          style={{
            width: "80px",
            height: "auto",
            borderRadius: "8px",
            marginRight: "20px",
          }}
        />
      </Column>
      <Column>
        <Text>
          {productTitle}
          {title !== "Default Title" && ` - ${title}`}
        </Text>
        {price && (
          <div>
            {compareAtPrice ? (
              <span style={{ color: "#999" }}>
                {price
                  .split("")
                  .map((char) => char + "\u0336")
                  .join("")}
              </span>
            ) : (
              price
            )}
            {compareAtPrice && (
              <span
                style={{
                  display: "inlineBlock",
                  padding: "5px",
                  borderRadius: "8px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  fontSize: "1em",
                }}
              >
                {compareAtPrice}
              </span>
            )}
          </div>
        )}
      </Column>
    </Row>
  );
}
