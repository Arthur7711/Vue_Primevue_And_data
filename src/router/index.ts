import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
 type RouterOptions,
} from "vue-router";

const studiosRoutes = [
  {
    path: "/",
    redirect: "/studios",
  },
  {
    path: "/studios",
    name: "Studios",
    component: () => import("@/pages/Studios/Studios.vue"),
  },
  {
    path: "/studios/:id/project",
    name: "StudiosProjects",
    component: () => import("@/pages/Studios/StudiosProjects.vue"),
  },
  {
    path: "/studios/:id/department",
    name: "StudiosDepartments",
    component: () => import("@/pages/Studios/StudiosDepartments.vue"),
  },
  {
    path: "/studios/:id/hr",
    name: "StudiosHR",
    component: () => import("@/pages/Studios/StudiosHR.vue"),
  },
];
const projectRoutes = [
  {
    path: "/projects",
    name: "Projects",
    component: () => import("@/pages/Projects/Projects.vue"),
  },
  {
    path: "/projects/:project/information",
    name: "ProjectInformation",
    component: () => import("@/pages/Projects/ProjectInformation.vue"),
  },
  {
    path: "/projects/:project/milestone",
    name: "ProjectMilestone",
    component: () => import("@/pages/Projects/ProjectMilestone.vue"),
  },
  {
    path: "/projects/:project/analytics",
    name: "ProjectAnalytics",
    component: () => import("@/pages/Projects/ProjectAnalytics.vue"),
  },
  {
    path: "/projects/:project/logs",
    name: "ProjectLogs",
    component: () => import("@/pages/Projects/ProjectLogs.vue"),
  },
  {
    path: "/projects/:project/documents",
    name: "ProjectDocuments",
    component: () => import("@/pages/Projects/ProjectDocuments.vue"),
  },
];
const staffRoutes = [
  {
    path: "/staff",
    name: "Staff",
    component: () => import("@/pages/Staff/Staff.vue"),
  },
  {
    path: "/staff/:id",
    name: "StaffUser",
    component: () => import("@/pages/Staff/StaffUser.vue"),
  },
];
const allocationRoutes = [
  {
    path: "/allocation",
    name: "Allocation",
    component: () => import("@/pages/Allocation/Allocation.vue"),
  },
];
const settingsRoutes = [
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/pages/Settings/Settings.vue"),
  },
  {
    path: "/settings_projects/:id",
    name: "ProjectInfo",
    component: () => import("@/components/Settings/Projects/ProjectInfo.vue"),
  },
];
const reportsRoutes = [
  {
    path: "/reports",
    name: "Reports",
    component: () => import("@/pages/Reports/ReportsPage.vue"),
  },
  {
    path: "/reports/:name",
    name: "ImportingReports",
    component: () =>
      import("@/pages/Reports/ImportingReports/ImportingReport.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...studiosRoutes,
    ...projectRoutes,
    ...staffRoutes,
    ...allocationRoutes,
    ...settingsRoutes,
    ...reportsRoutes,
  ],
} as RouterOptions);

export default router;
