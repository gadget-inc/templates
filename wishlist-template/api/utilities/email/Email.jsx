import {
  Button,
  Container,
  Html,
  Section,
  Column,
  Text,
  Row,
} from "@react-email/components";

export default ({ name, onSale, removed, count }) => {
  return (
    <Html>
      <Text>Hello {name},</Text>
      <Container>
        {onSale.length && (
          <Section>
            <Text>Some of the products on your wishlist are on sale!</Text>
            {onSale?.map(
              ({
                id,
                title,
                price,
                compareAtPrice,
                image: { source, alt },
              }) => (
                <Row key={id}>
                  <Column>
                    <img src={source} alt={alt} />
                  </Column>
                  <Column>
                    <Text>{title}</Text>
                    <div>
                      <span>{compareAtPrice}</span>
                      <span
                        style={{
                          display: "inlineBlock",
                          padding: "0.5em 1em",
                          borderRadius: "25px",
                          backgroundColor: "#f0f0f0",
                          color: "#333",
                          textDecoration: "lineThrough",
                          fontSize: "1em",
                        }}
                      >
                        {price}
                      </span>
                    </div>
                  </Column>
                </Row>
              )
            )}
          </Section>
        )}
        {removed.length && (
          <Section>
            <Text>
              Unfortunately, the following products are no longer available.
            </Text>
            {removed?.map(({ id, title, image: { source, alt } }) => (
              <Row key={id}>
                <Column>
                  <img src={source} alt={alt} />
                </Column>
                <Column>
                  <Text>{title}</Text>
                </Column>
              </Row>
            ))}
          </Section>
        )}
        {!count && (
          <Section>
            <Text>
              There haven't been any recent changes to the items on your
              wishlist. While we keep an eye out for any updates to your desired
              products, why not explore our shop for new arrivals and
              bestsellers? You might discover something you love!
            </Text>
          </Section>
        )}
        <Section>
          {/* domain + path + customer */}
          <Button href={``} target="_blank">
            More information
          </Button>
        </Section>
      </Container>
    </Html>
  );
};
