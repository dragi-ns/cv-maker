import { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Button } from './buttons';

class Header extends Component {
  render() {
    const { t, i18n } = this.props;

    return (
      <header className="app-header">
        <h1 className="logo">{t('title')}</h1>
        <div className="language-buttons row">
          <Button
            data={{ label: 'en' }}
            onClick={() => i18n.changeLanguage('en')}
            disabled={i18n.language === 'en'}
          />
          <Button
            data={{ label: 'sr' }}
            onClick={() => i18n.changeLanguage('sr')}
            disabled={i18n.language === 'sr'}
          />
        </div>
      </header>
    );
  }
}

export default withTranslation('main')(Header);
