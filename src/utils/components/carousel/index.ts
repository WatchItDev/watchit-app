import {CalculateItemsPerSlideProps} from "@src/utils/components/carousel/types.ts";

/**
 * Calculates the optimal number of items per slide based on the width of the parent container
 * and the constraints of minimum and maximum item widths.
 *
 * @param {Object} calculateItemsPerSlideProps - The input properties to calculate the items.
 * @param {number} calculateItemsPerSlideProps.parentWidth - The width of the parent container.
 * @param {number} calculateItemsPerSlideProps.minItemWidth - The minimum width allowed for a single item.
 * @param {number} calculateItemsPerSlideProps.maxItemWidth - The maximum width allowed for a single item.
 * @returns {number} The optimal number of items that can fit within the parent container.
 */
export const calculateItemsPerSlide = ({parentWidth, minItemWidth, maxItemWidth} : CalculateItemsPerSlideProps): number => {
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
