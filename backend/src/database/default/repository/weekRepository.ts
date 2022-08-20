import {
    getRepository,
    FindOneOptions,
    DeleteResult,
  } from "typeorm";
  import moduleLogger from "../../../shared/functions/logger";
  import Week from "../entity/week";
  
  const logger = moduleLogger("weekRepository");
  
  export const findById = async (
    id: string,
    opts?: FindOneOptions<Week>
  ): Promise<Week> => {
    logger.info("Find by id");
    const repository = getRepository(Week);
    const data = await repository.findOne(id, opts);
    return data;
  };
  
  export const create = async (payload: Week): Promise<Week> => {
    logger.info("Create");
    const repository = getRepository(Week);
    const newdata = await repository.save(payload);
    return newdata;
  };
  
  export const deleteById = async (
    id: string | string[]
  ): Promise<DeleteResult> => {
    logger.info("Delete by id");
    const repository = getRepository(Week);
    return await repository.delete(id);
  };
  