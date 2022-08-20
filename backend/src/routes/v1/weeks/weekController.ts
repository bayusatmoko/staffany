import { Request, ResponseToolkit } from "@hapi/hapi";
import * as weekUsecase from "../../../usecases/weekUsecase";
import { errorHandler } from "../../../shared/functions/error";
import {
  ICreateWeek,
  ISuccessResponse,
} from "../../../shared/interfaces";
import moduleLogger from "../../../shared/functions/logger";

const logger = moduleLogger("weekController");

export const create = async (req: Request, h: ResponseToolkit) => {
  logger.info("Create week");
  try {
    const body = req.payload as ICreateWeek;
    const data = await weekUsecase.create(body);
    const res: ISuccessResponse = {
      statusCode: 200,
      message: "Create week successful",
      results: data,
    };
    return res;
  } catch (error) {
    logger.error(error.message)
    return errorHandler(h, error);
  }
};
