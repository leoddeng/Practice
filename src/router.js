import { createRouter, createWebHistory } from "vue-router";
const nameMap = {
  [""]: "首页",
  AuthorizationComponent: "权限组件",
  ResponsiveLayout: "响应式布局",
};
const generateRoutes = () => {
  const routes = [];
  const modules = import.meta.glob("./pages/**/index.vue");
  const reg = /(?<=pages\/)(\w+)(?=\/)/g;
  for (const path in modules) {
    const matches = path.match(reg);
    const name = (matches && matches[0]) || "";
    routes.push({
      path: `/${name}`,
      name: nameMap[name],
      component: () => import(path),
      meta: {
        title: nameMap[name],
      },
    });
  }
  return routes;
};
const router = createRouter({
  history: createWebHistory(),
  routes: generateRoutes(),
});
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
