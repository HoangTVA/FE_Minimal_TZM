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
    brandMap: path(ROOTS_DASHBOARD, '/brand-map'),
    comingSoon: path(ROOTS_DASHBOARD, '/coming-soon')
  },
  store: {
    root: path(ROOTS_DASHBOARD, '/manage-store'),
    add: path(ROOTS_DASHBOARD, '/manage-store/add'),
    details: path(ROOTS_DASHBOARD, '/manage-store/details'),
    editInfo: path(ROOTS_DASHBOARD, '/manage-store/details/edit-info'),
    editAttrs: path(ROOTS_DASHBOARD, '/manage-store/details/edit-attrs'),
    editTemplates: path(ROOTS_DASHBOARD, '/manage-store/details/edit-templates')
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
