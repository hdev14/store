import Dimensions from '../../../src/catalog/domain/Dimensions';

describe('Dimenions Unit Tests', () => {
  it('returns the correct text, informing the height, width and depth of the dimensions', () => {
    const height = Math.random() * 100;
    const width = Math.random() * 100;
    const depth = Math.random() * 100;

    const dimensions = new Dimensions({ height, width, depth });

    expect(dimensions.toString()).toEqual(`LxAxP: ${width} x ${height} x ${depth}`);
  });
});
