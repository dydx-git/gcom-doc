import { test } from '@japa/runner'
import { expect } from '@japa/expect'
import client from '../src/lib/services/db/client.js'
import { Gmailer } from '../src/lib/modules/gmail/gmail.js'


test('Gmail.authenticate', async (ctx, done) => {
  const { expect } = ctx;
  const company = await client.company.findFirst();
  if (!company) {
    done(new Error('No company found'));
    return;
  }

  expect(Gmailer.getInstance(company)).toBeInstanceOf(Gmailer)
})
  .disableTimeout()
  .waitForDone()