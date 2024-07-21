/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  FindOptionsWhere,
  ObjectId,
} from "typeorm";

export interface FindAllWithPaginatedOptions {
  page: number;
  limit: number;
}

export abstract class BaseService<Entity> {
  abstract findAll(criteria?: FindManyOptions<Entity>): Promise<Entity[]>;

  abstract findAllWithPaginated(
    options: FindAllWithPaginatedOptions,
  ): Promise<[Entity[], number]>;

  abstract findOne(
    criteria: string | number | Date | ObjectId,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity>;

  abstract create(payloads: Entity | Entity[]): Promise<Entity | Entity[]>;

  abstract update(
    criteria: string | number | Date | ObjectId,
    payloads: Entity,
  ): Promise<Entity>;

  abstract delete(
    criteria:
      | string
      | number
      | Date
      | ObjectId
      | string[]
      | number[]
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<Entity>,
  ): Promise<DeleteResult>;

  protected toArrayEntities(payloads: Entity | Entity[]) {
    return Array.isArray(payloads) ? payloads : [payloads];
  }
}
