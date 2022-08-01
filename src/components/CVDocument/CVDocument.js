import { Component } from 'react';
import { GENDERS } from '../CVForm/GeneralSection';
import { LEVELS } from '../CVForm/SkillsSection';
import { format } from 'date-fns';
import { RichInput } from '../inputs';
import { formatDate } from '../CVForm/helpers';
import {
  Page,
  Text,
  View,
  Document as PDFDocument,
  Image,
  Font,
  Link,
} from '@react-pdf/renderer';
import { withTranslation } from 'react-i18next';

import CVHeader from './CVHeader';
import CVColumn from './CVColumn';
import { CVCard, CVCardHeader, CVCardBody, CVCardBodyListItem } from './CVCard';
import RichText from './CVRichText';
import styles from './styles';

import pageBackground from '../../images/cv-page-background.png';
import genderIcon from '../../images/cv-gender-icon.png';
import birthDateIcon from '../../images/cv-birth-date-icon.png';
import emailIcon from '../../images/cv-email-icon.png';
import phoneIcon from '../../images/cv-phone-icon.png';
import websiteIcon from '../../images/cv-website-icon.png';
import locationIcon from '../../images/cv-location-icon.png';
import educationIcon from '../../images/cv-education-icon.png';
import workIcon from '../../images/cv-work-icon.png';
import circleIcon from '../../images/cv-circle-icon.png';

import Roboto from '../../fonts/Roboto-Regular.ttf';
import RobotoMedium from '../../fonts/Roboto-Medium.ttf';
import RobotoMediumItalic from '../../fonts/Roboto-MediumItalic.ttf';
import RobotoBold from '../../fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from '../../fonts/Roboto-BoldItalic.ttf';

class CVDocument extends Component {
  render() {
    const { t, i18n } = this.props;
    const {
      avatar,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      country,
      dateOfBirth,
      gender,
      website,
    } = this.props.values.general;

    const { objective } = this.props.values;
    const objectiveCharCount =
      RichInput.WrappedComponent.getCharCount(objective);

    const { interests, traits, education, work, skills } = this.props.values;

    return (
      <PDFDocument>
        <Page size="A4" style={styles.page}>
          <Image style={styles.pageBackground} src={pageBackground} />
          <CVHeader values={{ avatar, firstName, lastName }} />
          <View style={styles.wrapper}>
            <CVColumn>
              <CVCard style={avatar && { paddingTop: '42.5px' }}>
                {!avatar && <CVCardHeader>{t('general.title')}</CVCardHeader>}
                <CVCardBody>
                  {gender && (
                    <CVCardBodyListItem
                      icon={genderIcon}
                      text={t(GENDERS.find((g) => g.value === gender).label)}
                    />
                  )}

                  {dateOfBirth && (
                    <CVCardBodyListItem
                      icon={birthDateIcon}
                      text={format(new Date(dateOfBirth), 'dd.MM.yyyy.')}
                    />
                  )}

                  <CVCardBodyListItem
                    icon={emailIcon}
                    text={
                      <Link style={styles.link} src={`mailto:${email}`}>
                        {email}
                      </Link>
                    }
                  />

                  <CVCardBodyListItem
                    icon={phoneIcon}
                    text={
                      <Link style={styles.link} src={`tel:${phone}`}>
                        {phone}
                      </Link>
                    }
                  />

                  {website && (
                    <CVCardBodyListItem
                      icon={websiteIcon}
                      text={
                        <Link style={styles.link} src={website}>
                          {website}
                        </Link>
                      }
                    />
                  )}

                  {(address || city || country) && (
                    <CVCardBodyListItem
                      icon={locationIcon}
                      text={[address, city, country]
                        .filter((item) => item.length > 0)
                        .join(', ')}
                    />
                  )}
                </CVCardBody>

                {avatar && <Image style={styles.avatar} src={avatar} />}
              </CVCard>

              {objectiveCharCount > 0 && (
                <CVCard style={{ paddingBottom: '10px' }}>
                  <CVCardHeader>{t('objective.title')}</CVCardHeader>
                  <CVCardBody>
                    <RichText editorState={objective} />
                  </CVCardBody>
                </CVCard>
              )}

              {interests.length > 0 && (
                <CVCard>
                  <CVCardHeader>{t('interests.title')}</CVCardHeader>
                  <CVCardBody>
                    {interests.map(({ interest }, index) => (
                      <CVCardBodyListItem
                        key={index}
                        icon={circleIcon}
                        text={interest}
                      />
                    ))}
                  </CVCardBody>
                </CVCard>
              )}

              {traits.length > 0 && (
                <CVCard>
                  <CVCardHeader>{t('traits.title')}</CVCardHeader>
                  <CVCardBody>
                    {traits.map(({ trait }, index) => (
                      <CVCardBodyListItem
                        key={index}
                        icon={circleIcon}
                        text={trait}
                      />
                    ))}
                  </CVCardBody>
                </CVCard>
              )}
            </CVColumn>

            <CVColumn style={{ flexGrow: 1.5 }}>
              {education.length > 0 && (
                <CVCard>
                  <CVCardHeader>{t('education.title')}</CVCardHeader>
                  <CVCardBody>
                    {education.map((edu, index) => (
                      <View key={index} style={{ marginBottom: '10px' }}>
                        <CVCardBodyListItem
                          icon={educationIcon}
                          text={
                            <>
                              <Text style={{ fontWeight: 500 }}>
                                {edu.school}
                              </Text>
                              , {edu.degree}
                            </>
                          }
                          style={{ marginBottom: '2.5px' }}
                        />
                        <Text style={{ marginBottom: '2.5px' }}>
                          {formatDate(edu.startDate, 'MMM yyyy', i18n.language)}{' '}
                          -{' '}
                          {t(
                            formatDate(edu.endDate, 'MMM yyyy', i18n.language)
                          )}
                        </Text>
                        {RichInput.WrappedComponent.getCharCount(
                          edu.description
                        ) && <RichText editorState={edu.description} />}
                      </View>
                    ))}
                  </CVCardBody>
                </CVCard>
              )}

              {work.length > 0 && (
                <CVCard>
                  <CVCardHeader>{t('work.title')}</CVCardHeader>
                  <CVCardBody>
                    {work.map((w, index) => (
                      <View key={index} style={{ marginBottom: '10px' }}>
                        <CVCardBodyListItem
                          icon={workIcon}
                          text={
                            <>
                              <Text style={{ fontWeight: 500 }}>
                                {w.company}
                              </Text>
                              , {w.jobTitle}
                            </>
                          }
                          style={{ marginBottom: '2.5px' }}
                        />
                        <Text style={{ marginBottom: '2.5px' }}>
                          {formatDate(w.startDate, 'MMM yyyy', i18n.language)} -{' '}
                          {t(formatDate(w.endDate, 'MMM yyyy', i18n.language))}
                        </Text>
                        {RichInput.WrappedComponent.getCharCount(
                          w.description
                        ) && <RichText editorState={w.description} />}
                      </View>
                    ))}
                  </CVCardBody>
                </CVCard>
              )}

              {skills.length > 0 && (
                <CVCard>
                  <CVCardHeader>{t('skills.title')}</CVCardHeader>
                  <CVCardBody>
                    {skills.map(({ skill, level }, index) => (
                      <View key={index}>
                        <CVCardBodyListItem
                          icon={circleIcon}
                          text={
                            <>
                              <Text style={{ fontWeight: 500 }}>{skill}</Text>,{' '}
                              {t(LEVELS.find((l) => l.value === level).label)}
                            </>
                          }
                        />
                      </View>
                    ))}
                  </CVCardBody>
                </CVCard>
              )}
            </CVColumn>
          </View>
        </Page>
      </PDFDocument>
    );
  }
}

export default withTranslation('form')(CVDocument);

Font.register({
  family: 'Roboto',
  fonts: [
    { src: Roboto }, // font-style: normal, font-weight: normal
    { src: RobotoMedium, fontWeight: 500 },
    { src: RobotoMediumItalic, fontStyle: 'italic', fontWeight: 500 },
    { src: RobotoBold, fontWeight: 700 },
    { src: RobotoBoldItalic, fontStyle: 'italic', fontWeight: 700 },
  ],
});
