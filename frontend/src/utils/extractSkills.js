export const extractSkills = (resumeText, requiredSkills) => {
  const lowerText = resumeText.toLowerCase();

  const matched = requiredSkills.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );

  const missing = requiredSkills.filter(
    skill => !matched.includes(skill)
  );

  return { matched, missing };
};
