import { useState } from "react";
import { Box, Icon, InlineStack } from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";
import { Controller, useFormContext } from "@gadgetinc/react";

export default ({ totalStars = 5 }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const { control } = useFormContext();

  const handleMouseEnter = (index) => {
    setHoveredStar(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  return (
    <Controller
      control={control}
      name="rating"
      render={({ field: { ref, ...fieldProps } }) => (
        <InlineStack>
          {Array.from({ length: totalStars }, (_, index) => (
            <Box
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => fieldProps.onChange(index + 1)}
              style={{ cursor: "pointer" }}
              fieldprops={fieldProps}
            >
              <Icon
                source={
                  index < (hoveredStar || fieldProps.value)
                    ? StarFilledIcon
                    : StarIcon
                }
              />
            </Box>
          ))}
        </InlineStack>
      )}
    />
  );
};
