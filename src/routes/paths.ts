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
    brandMap: path(ROOTS_DASHBOARD, '/brand-map'),
  },
  store: {
    root: path(ROOTS_DASHBOARD, '/manage-store'),
    add: path(ROOTS_DASHBOARD, '/manage-store/add'),
    details: path(ROOTS_DASHBOARD, '/manage-store/details'),
    editInfo: path(ROOTS_DASHBOARD, '/manage-store/details/edit-info'),
    editAttrs: path(ROOTS_DASHBOARD, '/manage-store/details/edit-attrs'),
  },
  poi: {
    root: path(ROOTS_DASHBOARD, '/pois'),
    add: path(ROOTS_DASHBOARD, '/pois/add'),
    details: path(ROOTS_DASHBOARD, '/pois/details'),
  },
  poiBrand: {
    root: path(ROOTS_DASHBOARD, '/brand-pois'),
    add: path(ROOTS_DASHBOARD, '/brand-pois/add'),
    details: path(ROOTS_DASHBOARD, '/brand-pois/details'),
  },
  template: {
    root: path(ROOTS_DASHBOARD, '/templates'),
  }
};
