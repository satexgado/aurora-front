import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DiscussionModule } from './discussion/discussion.module';
import { DiscussionComponent } from './discussion/discussion.component';
import { DiscussionShowComponent } from './discussion/discussion-show/discussion-show.component';

const routes: Routes = [
  {
    path: 'discussion',
    component: DiscussionComponent,
    children: [
      {
        path: ':id',
        component: DiscussionShowComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'discussion',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    DiscussionModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class MessagerieModule {}
