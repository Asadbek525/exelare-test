import { Routes } from '@angular/router';
import { Candidates } from './pages/candidates/candidates';
import { CandidateProfile } from './pages/candidate-profile/candidate-profile';

export default [
  {
    path: '',
    component: Candidates,
  },
  {
    path: ':id',
    component: CandidateProfile,
  },
] as Routes;
