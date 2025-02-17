import {calculateItemsPerSlideProps} from "@src/components/carousel/variants/utils/types.ts";

export const calculateItemsPerSlide = ({parentWidth, minItemWidth, maxItemWidth} : calculateItemsPerSlideProps) => {
  let maxItems = Math.floor(parentWidth / minItemWidth);
  let minItems = Math.floor(parentWidth / maxItemWidth);
  let items = maxItems;

  while (items >= minItems) {
    const itemWidth = parentWidth / items;
    if (itemWidth >= minItemWidth && itemWidth <= maxItemWidth) {
      break;
    }
    items--;
  }

  if (items < 1) items = 1;

  return items;
};
