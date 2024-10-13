export interface StackItem {
  name: string;
  src: string;
}

interface BaseExperience {
  name: string;
  startDate: Date;
  endDate: Date | "present";
  stack: StackItem[];
  summary: string[];
  highlights: string[];
  position: string;
  url?: string;
}

export interface Mission {
  name: string;
  position: string;
  startDate: Date;
  endDate: Date | "present";
}

interface ExperienceWithMissions extends BaseExperience {
  missions: Mission[];
}

interface ExperienceWithoutMissions extends BaseExperience {}

export type Experience = ExperienceWithMissions | ExperienceWithoutMissions;

export type Resume = {
  experiences: Experience[];
};
