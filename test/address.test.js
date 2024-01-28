import supertest from "supertest";
import { createTestAddress, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";

describe('POST /api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  })

  afterEach(async () => {
    await removeAllTestAddresses()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can create new address', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: 'Jalan test',
        city: 'Kota test',
        province: 'Provinsi test',
        country: 'Indonesia',
        postal_code: '123123'
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe("Jalan test")
    expect(result.body.data.city).toBe("Kota test")
    expect(result.body.data.province).toBe("Provinsi test")
    expect(result.body.data.country).toBe("Indonesia")
    expect(result.body.data.postal_code).toBe("123123")
  })

  it('should reject if request is invalid', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: 'Jalan test',
        city: 'Kota test',
        province: 'Provinsi Test',
        country: '',
        postal_code: ''
      })

    expect(result.status).toBe(400)
  })

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post(`/api/contacts/${testContact.id + 1}/addresses`)
      .set('Authorization', 'test')
      .send({
        street: 'Jalan test',
        city: 'Kota test',
        province: 'Provinsi Test',
        country: '',
        postal_code: ''
      })

    expect(result.status).toBe(404)
  })
})

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  })

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  })

  it('Should can get address', async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
      .set('Authorization', 'test');

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe("Jalan test")
    expect(result.body.data.city).toBe("Kota test")
    expect(result.body.data.province).toBe("Provinsi test")
    expect(result.body.data.country).toBe("Indonesia")
    expect(result.body.data.postal_code).toBe("123123")
  })

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + (testAddress.id))
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
  });

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get('/api/contacts/' + (testContact.id) + '/addresses/' + (testAddress.id + 1))
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
})

describe('PUT /api/contacts/:contactId/addresses/:addressId', function () {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  })

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  })

  it('should can update address', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
      .set('Authorization', 'test')
      .send({
        street: "street",
        city: 'city',
        province: 'provinsi',
        country: 'indonesia',
        postal_code: '1111'
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testAddress.id);
    expect(result.body.data.street).toBe("street");
    expect(result.body.data.city).toBe("city");
    expect(result.body.data.province).toBe("provinsi");
    expect(result.body.data.country).toBe("indonesia");
    expect(result.body.data.postal_code).toBe("1111");
  });

  it('should reject if request is not valid', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
      .set('Authorization', 'test')
      .send({
        street: "street",
        city: 'city',
        province: 'provinsi',
        country: '',
        postal_code: ''
      });

    expect(result.status).toBe(400);
  });

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
      .set('Authorization', 'test')
      .send({
        street: "street",
        city: 'city',
        province: 'provinsi',
        country: 'indonesia',
        postal_code: '2312323'
      });

    expect(result.status).toBe(404);
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
      .set('Authorization', 'test')
      .send({
        street: "street",
        city: 'city',
        province: 'provinsi',
        country: 'indonesia',
        postal_code: '2312323'
      });

    expect(result.status).toBe(404);
  });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  })

  afterEach(async () => {
    await removeAllTestAddresses();
    await removeAllTestContacts();
    await removeTestUser();
  })

  it('should can remove address', async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
  });

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
});
