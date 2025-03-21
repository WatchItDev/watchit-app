import { describe, it, expect } from 'vitest';
import { flattenArray } from '../flatten-array';

describe('[UTILS]: flattenArray', () => {
  it('flattens a simple nested array with default key', () => {
    const nestedArray = [
      { id: 1, name: 'Parent 1', children: [{ id: 2, name: 'Child 1' }] },
      { id: 3, name: 'Parent 2', children: [{ id: 4, name: 'Child 2' }] }
    ];

    // @ts-expect-error - intentionally testing to match properties
    const result = flattenArray(nestedArray);

    expect(result).toHaveLength(4);
    expect(result.map(item => item.id)).toEqual([1, 3, 2, 4]);
  });

  it('flattens deeply nested arrays', () => {
    const deeplyNested = [
      {
        id: 1,
        name: 'Level 1',
        children: [
          {
            id: 2,
            name: 'Level 2',
            children: [
              { id: 3, name: 'Level 3' }
            ]
          }
        ]
      },
      { id: 4, name: 'Another Parent' }
    ];

    // @ts-expect-error - intentionally testing to match properties
    const result = flattenArray(deeplyNested);

    expect(result).toHaveLength(4);
    expect(result.map(item => item.id)).toEqual([1, 4, 2, 3]);
  });

  it('works with a custom key', () => {
    const nestedWithCustomKey = [
      { id: 1, name: 'Parent 1', subItems: [{ id: 2, name: 'Sub 1' }] },
      { id: 3, name: 'Parent 2', subItems: [{ id: 4, name: 'Sub 2' }] }
    ];

    const result = flattenArray(nestedWithCustomKey, 'subItems');

    expect(result).toHaveLength(4);
    expect(result.map(item => item.id)).toEqual([1, 3, 2, 4]);
  });

  it('handles empty arrays', () => {
    const result = flattenArray([]);

    expect(result).toEqual([]);
  });

  it('handles arrays with no children', () => {
    const noChildren = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];

    const result = flattenArray(noChildren);

    expect(result).toHaveLength(2);
    expect(result.map(item => item.id)).toEqual([1, 2]);
  });

  it('handles arrays with empty children arrays', () => {
    const emptyChildren = [
      { id: 1, name: 'Parent 1', children: [] },
      { id: 2, name: 'Parent 2', children: [] }
    ];

    const result = flattenArray(emptyChildren);

    expect(result).toHaveLength(2);
    expect(result.map(item => item.id)).toEqual([1, 2]);
  });

  it('preserves all properties in flattened objects', () => {
    const withProperties = [
      {
        id: 1,
        name: 'Parent',
        extra: 'data',
        children: [
          { id: 2, name: 'Child', flag: true }
        ]
      }
    ];

    // @ts-expect-error - intentionally testing to match properties
    const result = flattenArray(withProperties);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ id: 1, name: 'Parent', extra: 'data' });
    expect(result[1]).toMatchObject({ id: 2, name: 'Child', flag: true });
  });

  it('handles null or undefined list gracefully', () => {
    // @ts-expect-error - intentionally testing with null
    const nullResult = flattenArray(null);
    expect(nullResult).toEqual(undefined);

    // @ts-expect-error - intentionally testing with undefined
    const undefinedResult = flattenArray(undefined);
    expect(undefinedResult).toEqual(undefined);
  });

  it('matches snapshot for various inputs', () => {
    const testData = [
      { id: 1, name: 'Root', children: [
        { id: 2, name: 'Branch', children: [
          { id: 3, name: 'Leaf' }
        ]}
      ]},
      { id: 4, name: 'Standalone' }
    ];

    // @ts-expect-error - intentionally testing to match snapshot
    const result = flattenArray(testData);
    expect(result).toMatchSnapshot();
  });
});
