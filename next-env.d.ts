/// <reference types="next" />
/// <reference types="next/types/global" />

type Users = {
  [key: string]: UserData;
};

type UserData = {
  name: string;
  score: number;
  handicap: number;
};

type Result = {
  id: string;
  name: string;
  time: number;
};

type Settings = {
  firstBuzzOnly: boolean;
};
