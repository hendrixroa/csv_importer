import { suite, test } from '@testdeck/mocha';
import { assert } from 'chai';
import { readFileSync } from 'fs';

import { ModuleTestUtil } from 'test/util/module.test.util';
import { ImporterService } from '@/importer/importer.service';
import { ImporterPayload } from '@/importer/importer.dto';

@suite()
export class ImporterServiceTest {
  private importerService: ImporterService;
  private moduleTestUtil: ModuleTestUtil;

  async before(): Promise<void> {
    this.moduleTestUtil = new ModuleTestUtil();
    this.importerService = await this.moduleTestUtil.getImporterModule();
  }

  @test('Process without error the file and name provider')
  async processFileWithNotError(): Promise<void> {
    const filename = 'data_test.csv';
    const provider = { name: 'Spark' };
    const file = readFileSync('./data/' + filename);
    const fileArray = [
      {
        originalname: filename,
        encoding: 'utf8',
        mimetype: 'text/csv',
        buffer: file.buffer,
        size: 2000,
      } as ImporterPayload,
    ];
    const resultImporterService = await this.importerService.processFiles(
      fileArray,
      provider,
    );
    assert.isOk(resultImporterService === undefined);
  }

  @test('Check file with wrong name provider')
  async processFileWithProviderNameError(): Promise<void> {
    const filename = 'data_test.csv';
    const provider = { name: 'BadProvider' };
    const file = readFileSync('./data/' + filename);
    const fileArray = [
      {
        originalname: filename,
        encoding: 'utf8',
        mimetype: 'text/csv',
        buffer: file.buffer,
        size: 2000,
      } as ImporterPayload,
    ];
    const message = `NotFoundError: The provider ${provider.name} does not exists`;
    try {
      await this.importerService.processFiles(fileArray, provider);
      assert.fail(message);
    } catch (err) {}
  }

  @test('Check file with wrong data')
  async processFileWithDataError(): Promise<void> {
    const filename = 'data_wrong_fields.csv';
    const provider = { name: 'Spark' };
    const file = readFileSync('./data/' + filename);
    const fileArray = [
      {
        originalname: filename,
        encoding: 'utf8',
        mimetype: 'text/csv',
        buffer: file.buffer,
        size: 2000,
      } as ImporterPayload,
    ];
    try {
      await this.importerService.processFiles(fileArray, provider);
      assert.fail();
    } catch (err) {}
  }

  async after() {
    await this.moduleTestUtil.tearDownConnection();
  }
}
