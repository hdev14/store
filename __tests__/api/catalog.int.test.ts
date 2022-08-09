describe('Catalog\'s Integration Tests', () => {
  describe('/catalog/products/:id', () => {
    it("returns a not found response if product doesn't exist", async () => {
      expect.assertions(2);

      const fakeProductId = 'wrong';
      const response = await globalThis.request
        .get(`/catalog/products/${fakeProductId}`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('O produto não foi encontrado.');
    });
  });
});
