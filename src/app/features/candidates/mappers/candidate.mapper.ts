import { Candidate, CandidateDTO } from '../models/candidate.model';

export const mapDtoToCandidate = (record: CandidateDTO): Candidate => ({
  ...record,
  FullName:
    record.DisplayName ?? `${record.FirstName} ${record.LastName} ${record.MiddleName}`.trim(),
  PrimarySkills: (record.PrimarySkills?.split(',') ?? [])
    .map((skill) => skill.trim())
    .filter(Boolean),
  SkillMatrix: JSON.parse(record.SkillMatrix ? record.SkillMatrix : '[]'),
  AvatarLabel:
    (record.FirstName?.charAt(0)?.toUpperCase() ?? '') +
    (record.LastName?.charAt(0)?.toUpperCase() ?? ''),
  SecondarySkills: (record.SecondarySkills?.split(',') ?? []).map((skill) => skill.trim()),
});
