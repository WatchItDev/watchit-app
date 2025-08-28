import { data } from '../config-navigation-mini';

describe('[UI: mini sidebar items array', () => {
  it('to match the snapshot', () => {
    expect(data).toMatchSnapshot();
  });

  it('contains 5 items', () => {
    expect(data).toHaveLength(5);
  });

  it('each item has required properties', () => {
    data.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('icon');
      expect(item).toHaveProperty('badge');
      expect(item).toHaveProperty('bgColor');
    });
  });

  it('each item has a unique id', () => {
    const ids = data.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('each item has the correct badge', () => {
    data.forEach((item) => {
      expect(item.badge).toBe('Ideas for Builders');
    });
  });

  it('each item has the correct bgColor', () => {
    data.forEach((item) => {
      expect(item.bgColor).toBe('#4A34B8');
    });
  });
});
