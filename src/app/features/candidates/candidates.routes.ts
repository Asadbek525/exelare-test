import { Routes } from '@angular/router';
import { Candidates } from './pages/candidates/candidates';
import { CandidateProfile } from './pages/candidate-profile/candidate-profile';

export default [
  {
    path: '',
    component: Candidates,
  },
  {
    path: 'profile/:id',
    component: CandidateProfile,
  },
  {
    path: ':whichId',
    component: Candidates,
  },
] as Routes;
