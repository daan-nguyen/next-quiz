/// <reference types="next" />
/// <reference types="next/types/global" />

type Users = {
  [key: string]: UserData;
};

enum Answers {
  a = "a",
  b = "b",
  c = "c",
}

type UserData = {
  name: string;
  score: number;
  answer: Answers | null;
  eliminated: boolean;
  handicap: number;
};

type Result = {
  id: string;
  name: string;
  time: number;
  answer: string;
};

type Settings = {
  firstBuzzOnly: boolean;
  numAnswers: number;
};
