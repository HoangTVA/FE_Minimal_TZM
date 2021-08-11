// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import NotistackProvider from 'components/NotistackProvider';
import '@fortawesome/fontawesome-free/css/all.min.css';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <RtlLayout>
          <NotistackProvider>
            {/* <Settings /> */}
            <ScrollToTop />
            <Router />
          </NotistackProvider>
        </RtlLayout>
      </ThemePrimaryColor>
    </ThemeConfig>
  );
}
