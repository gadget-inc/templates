import { useState } from "react";
import { Icon, InlineStack } from "@shopify/polaris";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";

export default ({ rating = 0, totalStars = 5, onRate }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleMouseEnter = (index) => {
    setHoveredStar(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredStar(0);
  };

  const handleClick = (index) => {
    if (onRate) {
      onRate(index + 1);
    }
  };

  return (
    <InlineStack>
      {Array.from({ length: totalStars }, (_, index) => (
        <div
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          style={{ cursor: "pointer" }}
        >
          <Icon
            source={index < (hoveredStar || rating) ? StarFilledIcon : StarIcon}
          />
        </div>
      ))}
    </InlineStack>
  );
};
