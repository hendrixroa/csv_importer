import { Repository, SelectQueryBuilder } from 'typeorm';

import { BaseEntity } from '@common/base.entity';

export class BaseSelectOptions {
  public limit?: number;
  public page?: number;
  public items?: boolean;
  public count?: boolean;
}

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  protected getOneItem(items: T[] | undefined): T | undefined {
    return items ? items[0] || undefined : undefined;
  }

  protected getManyItems(items: T[] | undefined): T[] {
    return items || [];
  }

  protected async defaultSelect(
    qb: SelectQueryBuilder<T>,
    options: BaseSelectOptions,
  ): Promise<{ count: number; items: T[]; page: number; pages: number }> {
    if (options.page && options.limit) {
      qb.take(options.limit);
      qb.skip((options.page - 1) * options.limit);
    }

    const itemsQuery =
      options.items !== false ? qb.getMany() : Promise.resolve(undefined);

    const countQuery =
      options.count === true ? qb.getCount() : Promise.resolve(undefined);

    const [items, count] = await Promise.all([itemsQuery, countQuery]);

    const computedPages = Math.floor(count / options.limit);
    return {
      count: Number(count),
      items,
      page: options.page,
      pages: computedPages === 0 ? 1 : computedPages,
    };
  }

  public async insertBulk(items: T[]): Promise<T[]> {
    const qb = this.createQueryBuilder()
      .insert()
      .into(BaseEntity)
      .values(items)
      .returning('*');
    const result = await qb.execute();
    return result.generatedMaps as T[];
  }
}
