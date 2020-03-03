/// <reference types="next" />
/// <reference types="next/types/global" />

type Users = {
  [key: string]: string;
};

type Result = {
  id: string;
  name: string;
  time: number;
};

type Settings = {
  firstBuzzOnly: boolean;
};
