import * as weekRepository from "../database/default/repository/weekRepository";
import Week from "../database/default/entity/week";
import { ICreateWeek } from "../shared/interfaces";

export const findById = async (
    weekId: string,
  ): Promise<Week> => {
    return weekRepository.findById(weekId);
};
  
export const create = async (payload: ICreateWeek): Promise<Week> => {
    const week = new Week();
    week.weekId = payload.weekId
    
    return weekRepository.create(week);
};