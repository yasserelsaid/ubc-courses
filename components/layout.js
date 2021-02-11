import Header from './header';
import Footer from './footer';
import AdSense from 'react-adsense';
import Hidden from '@material-ui/core/Hidden';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <Hidden mdDown>
        <div>
          <AdSense.Google
            client='ca-pub-9351737408787682'
            slot='9639084048'
            format='auto'
            style={{ width: 250, height: 500, float: 'left', padding: '10px' }}
          />
          <AdSense.Google
            client='ca-pub-9351737408787682'
            slot='9639084048'
            format='auto'
            style={{ width: 250, height: 500, float: 'right', padding: '10px' }}
          />
        </div>
      </Hidden>

      <main>{children}</main>

      <Footer />
    </div>
  );
}
