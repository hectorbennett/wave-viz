export function merge_equations(equations_list: string[]) {
  const equations = [...equations_list];
  for (let i = 1; i <= equations.length - 1; i++) {
    equations[i] = equations[i].replaceAll("y", equations[i - 1]);
  }
  console.log(equations);
  return equations[equations.length - 1];
}

function test_merge_equations() {
  const equations = ["sin(x / 16)", "-y", "tanh(y * 2)", "y - cos(x / 3) / 5"];

  // should equal tanh(-sin(x / 16) * 2) - cos(x / 3) / 5
  console.log(merge_equations(equations));
}

test_merge_equations();
