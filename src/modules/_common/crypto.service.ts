import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as assert from 'assert';

@Injectable()
export class CryptoService {
  public static getRandomBytes(size = 8): string {
    assert.ok(size > 0);
    return randomBytes(size).toString('hex');
  }
}
