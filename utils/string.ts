export function isSnakeCase(str: string) {
  const regex = /^[a-z]+(_[a-z]+)*$/;

  return regex.test(str);
}

export function isNumericString(str: string): boolean {
  return /^\d+$/.test(str);
}
