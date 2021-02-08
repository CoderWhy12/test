import { create, all } from "mathjs";

const config = {
  number: "BigNumber"
};

const math = create(all, config);

export const evaluate = (expression = "") => {
  return math.evaluate(expression).toNumber();
};

export const calc = (expression = "") => {
  return math.evaluate(expression).toNumber();
};
