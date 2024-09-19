import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LeaningComponent } from './leaning/leaning.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { InsideModuleComponent } from './inside-module/inside-module.component';
import { InsideTopicComponent } from './inside-topic/inside-topic.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
    ],
  },

  {
    path: 'learning',
    component: LeaningComponent,
    pathMatch: 'full'
  },

  {
    path: 'inside-module/:moduleId',
    component: InsideModuleComponent,
    pathMatch: 'full'
  },

  {
    path: 'inside-topic/:moduleId',
    component: InsideTopicComponent,
    pathMatch: 'full'
  },

  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebModuleRoutingModule { }
