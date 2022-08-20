import * as shiftRepository from "../database/default/repository/shiftRepository";
import * as weekRepository from "../database/default/repository/weekRepository";
import { FindManyOptions, FindOneOptions } from "typeorm";
import Shift from "../database/default/entity/shift";
import { ICreateShift, IUpdateShift } from "../shared/interfaces";
import { HttpError } from '../shared/classes/HttpError';

export const find = async (opts: FindManyOptions<Shift>): Promise<Shift[]> => {
  return shiftRepository.find(opts);
};

export const findById = async (
  id: string,
  opts?: FindOneOptions<Shift>
): Promise<Shift> => {
  return shiftRepository.findById(id, opts);
};

export const create = async (payload: ICreateShift): Promise<any> => {
  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  const isWeekPublished = await weekRepository.findById(payload.weekId)

  if(isWeekPublished) {
    throw new HttpError(409, "Week Published")
  }

  let sameDateShifts = await shiftRepository.find({ where: {date: shift.date }})

  if(!sameDateShifts.length) {
    return shiftRepository.create(shift);
  }

  const inputStartTime = parseInt(shift.startTime.replace(":",""))
  const inputEndTime = parseInt(shift.endTime.replace(":",""))

  const overlappedTimeShifts = sameDateShifts.filter((shift) => {
    let startTime = parseInt(shift.startTime.replace(":",""))
    let endTime = parseInt(shift.endTime.replace(":",""))

    if(inputStartTime == startTime) {
      return true
    }
    if(inputStartTime > startTime && inputStartTime < endTime) {
      return true
    }
    if(inputEndTime > startTime && inputEndTime < endTime) {
      return true
    }
    if(inputStartTime < startTime && inputEndTime > endTime) {
      return true
    }
    return false
  })

  if(!overlappedTimeShifts.length){
    return shiftRepository.create(shift);
  }

  throw new HttpError(409, "Shift Overlaps")
};

export const updateById = async (
  id: string,
  payload: IUpdateShift
): Promise<Shift> => {
  const shift = new Shift();
  shift.name = payload.name;
  shift.date = payload.date;
  shift.startTime = payload.startTime;
  shift.endTime = payload.endTime;

  const isShiftPublished = await weekRepository.findById(payload.weekId)

  if(isShiftPublished) {
    throw new HttpError(409, "Shift Published")
  }

  let sameDateShifts = await shiftRepository.find({ where: {date: shift.date }})
  sameDateShifts = sameDateShifts.filter((shift) => shift.id !== id)

  if(!sameDateShifts.length) {
    return shiftRepository.updateById(id, shift);
  }

  const inputStartTime = parseInt(shift.startTime.replace(":",""))
  const inputEndTime = parseInt(shift.endTime.replace(":",""))

  const overlappedTimeShifts = sameDateShifts.filter((shift) => {
    let startTime = parseInt(shift.startTime.replace(":",""))
    let endTime = parseInt(shift.endTime.replace(":",""))

    if(inputStartTime == startTime) {
      return true
    }
    if(inputStartTime > startTime && inputStartTime < endTime) {
      return true
    }
    if(inputEndTime > startTime && inputEndTime < endTime) {
      return true
    }
    if(inputStartTime < startTime && inputEndTime > endTime) {
      return true
    }
    return false
  })

  if(!overlappedTimeShifts.length){
    return shiftRepository.updateById(id, shift);
  }

  throw new HttpError(409, "Shift Overlaps")
};

export const deleteById = async (id: string | string[]) => {
  return shiftRepository.deleteById(id);
};
