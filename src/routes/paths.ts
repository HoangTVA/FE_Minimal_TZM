// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------
export const PATH_AUTH = {
  homePage: path("", '/')
};
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    pageOne: path(ROOTS_DASHBOARD, '/one'),
    pageTwo: path(ROOTS_DASHBOARD, '/two'),
    pageThree: path(ROOTS_DASHBOARD, '/three'),
    storeManagementPage: path(ROOTS_DASHBOARD, '/manage-store'),
    brandMap: path(ROOTS_DASHBOARD, '/brand-map'),
    poi: path(ROOTS_DASHBOARD, '/pois'),
    poiBrand: path(ROOTS_DASHBOARD, '/brand-pois'),
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    pageFour: path(ROOTS_DASHBOARD, '/app/four'),
    pageFive: path(ROOTS_DASHBOARD, '/app/five'),
    pageSix: path(ROOTS_DASHBOARD, '/app/six'),
    homePage: path("", '/')
  }
};
