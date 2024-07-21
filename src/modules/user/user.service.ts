import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectId,
  Repository,
} from "typeorm"
import { BaseResourceService, FindAllWithPaginatedOptions } from "@/lib/service"
import { UserEntity } from "./entities/user.entity"

@Injectable()
export class UserService extends BaseResourceService<UserEntity> {
  @InjectRepository(UserEntity)
  private readonly userRepository: Repository<UserEntity>

  findAll(criteria?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(criteria)
  }

  findAllWithPaginated(
    options: FindAllWithPaginatedOptions,
  ): Promise<[UserEntity[], number]> {
    const { page, limit, ...findOptions } = options
    return this.userRepository.findAndCount({
      skip: page * limit,
      take: limit,
      ...findOptions,
    })
  }

  findOne(
    criteria: string | number | Date | ObjectId,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    return this.userRepository.findOne({
      ...options,
      where: {
        id: criteria as number,
        ...options.where,
      },
    })
  }

  findOneByEmail(criteria: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email: criteria } })
  }

  async create<P = DeepPartial<UserEntity | UserEntity[]>>(
    payloads: P,
  ): Promise<P extends UserEntity[] ? UserEntity[] : UserEntity> {
    const entities = this.toArrayEntities(payloads).map((item) =>
      this.userRepository.create(item as Partial<UserEntity>),
    )

    const result = await this.userRepository.save(entities)

    return Array.isArray(payloads) ? result : (result[0] as any)
  }

  async update(
    criteria: string | number | Date | ObjectId,
    payloads: UserEntity,
  ): Promise<UserEntity> {
    const result = await this.userRepository.update(criteria, payloads)

    if (result.affected <= 0) {
      throw new Error("Update failed")
    }

    return this.findOne(criteria)
  }

  delete(
    criteria:
      | string
      | number
      | Date
      | ObjectId
      | string[]
      | number[]
      | Date[]
      | ObjectId[]
      | FindOptionsWhere<UserEntity>,
  ): Promise<DeleteResult> {
    return this.userRepository.delete(criteria)
  }
}
