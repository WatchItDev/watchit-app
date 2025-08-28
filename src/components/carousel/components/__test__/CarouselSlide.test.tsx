import { it, expect, describe } from 'vitest';
import { render } from '@testing-library/react';

import CarouselSlide from '@src/components/carousel/components/carousel-slide.tsx';

describe('[COMPONENTS]: CarouselSlide', () => {
  const renderItem = (item: any) => <div>{item}</div>;

  it('to match snapshot', () => {
    const items = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'];
    const { baseElement } = render(
      <CarouselSlide items={items} itemsPerRow={2} renderItem={renderItem} />,
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('renders items in two rows when itemsPerRow is 2', () => {
    const items = ['item1', 'item2', 'item3', 'item4'];
    const { baseElement } = render(
      <CarouselSlide items={items} itemsPerRow={2} renderItem={renderItem} />,
    );
    expect(baseElement.querySelectorAll('div > div').length).toBe(11);
  });

  it('renders items in a single row when itemsPerRow is equal to the number of items', () => {
    const items = ['item1', 'item2'];
    const { container } = render(
      <CarouselSlide items={items} itemsPerRow={2} renderItem={renderItem} />,
    );
    expect(container.querySelectorAll('div > div').length).toBe(7);
  });

  it('renders no items when items array is empty', () => {
    const items: any[] = [];
    const { container } = render(
      <CarouselSlide items={items} itemsPerRow={2} renderItem={renderItem} />,
    );
    expect(container.querySelectorAll('div > div').length).toBe(3);
  });

  it('renders items correctly when itemsPerRow is greater than the number of items', () => {
    const items = ['item1'];
    const { container } = render(
      <CarouselSlide items={items} itemsPerRow={2} renderItem={renderItem} />,
    );
    expect(container.querySelectorAll('div > div').length).toBe(5);
  });

  it('renders items correctly when itemsPerRow is 1', () => {
    const items = ['item1', 'item2', 'item3'];
    const { container } = render(
      <CarouselSlide items={items} itemsPerRow={1} renderItem={renderItem} />,
    );
    expect(container.querySelectorAll('div > div').length).toBe(7);
  });
});
