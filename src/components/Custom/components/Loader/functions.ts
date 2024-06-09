import { type ILoaderProps } from "./types";

export const LoaderWidth = (arg: ILoaderProps) => {
  return arg.width ? (+arg.width ? arg.width + "px" : arg.width) : "48px";
};

export const LoaderHeight = (arg: ILoaderProps) => {
  return arg.height ? (+arg.height ? arg.height + "px" : arg.height) : "48px";
};
