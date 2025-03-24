import zxcvbn from "zxcvbn";

export function getPasswordStrength(password: string) {
  const { score, feedback } = zxcvbn(password);
  return { score, feedback };
}
