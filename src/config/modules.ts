import { AbilitiMap, Ability } from "src/models/Role";

/**
 * Canonical list of module identifiers used for plant admin authorization.
 * Keep this in sync with the values returned from `/plant/modules`.
 */
export enum ModuleId {
  DASHBOARD = 1,
  STUDENTS = 2,
  TEACHERS = 3,
  DONATIONS = 4,
  RESULT = 5,
  CLASSES = 6,
  ATTENDANCE = 8
}

export const FULL_ACCESS_ABILITIES: Ability = [
  AbilitiMap.READ,
  AbilitiMap.CREATE,
  AbilitiMap.UPDATE,
  AbilitiMap.DELETE,
];

export const Summary = (modules: ModuleId[]) => {
  return JSON.stringify({ modules: modules });
};

const gen = (_id: number, name: string) => ({ _id, name });

export const BasicModuleList = [
  gen(ModuleId.DASHBOARD, "Dashboard"),
];
export const AdditionalModuleList = [
  gen(ModuleId.CLASSES, "Classes"),
  gen(ModuleId.DONATIONS, "Donations"),
  gen(ModuleId.RESULT, "Result"),
  gen(ModuleId.STUDENTS, "Students"),
  gen(ModuleId.TEACHERS, "Teachers"),
  gen(ModuleId.ATTENDANCE, "Attendance"),
];
export const ModuleList = [...BasicModuleList, ...AdditionalModuleList];
