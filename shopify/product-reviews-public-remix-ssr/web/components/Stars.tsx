import { useState } from "react";
import { Box, Icon, InlineStack } from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";
import { Controller, useFormContext } from "@gadgetinc/react";

export default ({ rating }: { rating?: number }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const formContext = useFormContext();

  const handleMouseEnter = (index: number) => {
    setHoveredStar(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  return rating ? (
    <InlineStack>
      {Array.from({ length: 5 }, (_, index) => (
        <Box key={index}>
          <Icon source={index < rating ? StarFilledIcon : StarIcon} />
        </Box>
      ))}
    </InlineStack>
  ) : (
    <Controller
      control={formContext?.control}
      name="review.rating"
      render={({ field: { ref, ...fieldProps } }) => (
        <InlineStack>
          <InlineStack>
            <p>{formContext?.control ? "C" : "No C"}</p>
            <p>{JSON.stringify(formContext.getValues())}</p>

            <p>name{fieldProps.name}</p>
            <p>value{fieldProps.value}</p>
          </InlineStack>
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              {...fieldProps}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => fieldProps.onChange(index + 1)}
              style={{ cursor: "pointer" }}
            >
              <Icon
                source={
                  index < (hoveredStar || fieldProps.value)
                    ? StarFilledIcon
                    : StarIcon
                }
              />
            </div>
          ))}
        </InlineStack>
      )}
    />
  );
};
