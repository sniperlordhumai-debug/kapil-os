// =============================================================
// SKILLS-EXPORT — flattened skill index for the AI assistant.
// Built from skillCategories so the assistant always reflects the
// real Skill Vault data. No duplication of facts.
// =============================================================

import { skillCategories, type SkillItem } from "./skills";

export interface IndexedSkill extends SkillItem {
  category: string;
}

export const skills = skillCategories.map((c) => ({
  label: c.label,
  skills: c.skills,
}));

export const skillsIndex: IndexedSkill[] = skillCategories.flatMap((c) =>
  c.skills.map((s) => ({ ...s, category: c.label }))
);
