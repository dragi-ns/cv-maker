import { Component } from 'react';
import { GENDERS } from './CVForm/GeneralSection';
import { LEVELS } from './CVForm/SkillsSection';
import { format } from 'date-fns';
import { RichInput } from './inputs';
import { formatPeriod } from './CVForm/helpers';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer';

import pageBackground from '../images/cv-page-background.png';
import genderIcon from '../images/cv-gender-icon.png';
import birthDateIcon from '../images/cv-birth-date-icon.png';
import mailIcon from '../images/cv-mail-icon.png';
import phoneIcon from '../images/cv-phone-icon.png';
import websiteIcon from '../images/cv-website-icon.png';
import locationIcon from '../images/cv-location-icon.png';
import educationIcon from '../images/cv-education-icon.png';
import workIcon from '../images/cv-work-icon.png';
import circleIcon from '../images/cv-circle-icon.png';

import Roboto from '../fonts/Roboto-Regular.ttf';
import RobotoMedium from '../fonts/Roboto-Medium.ttf';
import RobotoMediumItalic from '../fonts/Roboto-MediumItalic.ttf';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoBoldItalic from '../fonts/Roboto-BoldItalic.ttf';

export default class CVDocument extends Component {
  render() {
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
      <Document>
        <Page size="A4" style={styles.page}>
          <Image style={styles.pageBackground} src={pageBackground} />
          <View style={styles.header}>
            {avatar ? (
              <>
                <View style={styles.column}> </View>
                <View
                  style={[
                    styles.column,
                    {
                      marginRight: '20px',
                      flexGrow: 1.25,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}>
                  <Text style={[styles.fullName, { fontSize: '18px' }]}>
                    {firstName} {lastName}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.fullName}>
                {firstName} {lastName}
              </Text>
            )}
          </View>
          <View style={styles.wrapper}>
            <View style={styles.column}>
              <View
                style={[
                  styles.card,
                  { paddingBottom: 0 },
                  avatar && { paddingTop: '30px' },
                ]}>
                {!avatar && (
                  <View style={styles.cardHeader}>
                    <Text>Personal Information</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  {gender && (
                    <View style={styles.cardBodyRow}>
                      <Image style={styles.cardBodyRowIcon} src={genderIcon} />
                      <Text>
                        {GENDERS.find((g) => g.value === gender).label}
                      </Text>
                    </View>
                  )}

                  {dateOfBirth && (
                    <View style={styles.cardBodyRow}>
                      <Image
                        style={styles.cardBodyRowIcon}
                        src={birthDateIcon}
                      />
                      <Text>
                        {format(new Date(dateOfBirth), 'dd.MM.yyyy.')}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardBodyRow}>
                    <Image style={styles.cardBodyRowIcon} src={mailIcon} />
                    <Text style={styles.textWrap}>{email}</Text>
                  </View>

                  <View style={styles.cardBodyRow}>
                    <Image style={styles.cardBodyRowIcon} src={phoneIcon} />
                    <Text>{phone}</Text>
                  </View>

                  {website && (
                    <View style={styles.cardBodyRow}>
                      <Image style={styles.cardBodyRowIcon} src={websiteIcon} />
                      <Text style={styles.textWrap}>{website}</Text>
                    </View>
                  )}

                  {(address || city || country) && (
                    <View style={styles.cardBodyRow}>
                      <Image
                        style={styles.cardBodyRowIcon}
                        src={locationIcon}
                      />
                      <Text style={styles.textWrap}>
                        {[address, city, country]
                          .filter((item) => item.length > 0)
                          .join(', ')}
                      </Text>
                    </View>
                  )}
                </View>

                {avatar && <Image style={styles.avatar} src={avatar} />}
              </View>

              {objectiveCharCount > 0 && (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text>Objective</Text>
                  </View>
                  <View style={styles.cardBody}>
                    <Text>
                      {objective.getCurrentContent().getPlainText('')}
                    </Text>
                  </View>
                </View>
              )}

              {interests.length > 0 && (
                <View style={[styles.card, { paddingBottom: 0 }]}>
                  <View style={styles.cardHeader}>
                    <Text>Interests</Text>
                  </View>
                  <View style={styles.cardBody}>
                    {interests.map(({ interest }, index) => (
                      <View key={index} style={styles.cardBodyRow}>
                        <Image
                          style={styles.cardBodyRowIcon}
                          src={circleIcon}
                        />
                        <Text style={styles.textWrap}>{interest}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {traits.length > 0 && (
                <View style={[styles.card, { paddingBottom: 0 }]}>
                  <View style={styles.cardHeader}>
                    <Text>Traits</Text>
                  </View>
                  <View style={styles.cardBody}>
                    {traits.map(({ trait }, index) => (
                      <View key={index} style={styles.cardBodyRow}>
                        <Image
                          style={styles.cardBodyRowIcon}
                          src={circleIcon}
                        />
                        <Text style={styles.textWrap}>{trait}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
            <View
              style={[styles.column, { marginRight: '20px', flexGrow: 1.25 }]}>
              {education.length > 0 && (
                <View style={[styles.card, { paddingBottom: 0 }]}>
                  <View style={styles.cardHeader}>
                    <Text>Education</Text>
                  </View>
                  <View style={styles.cardBody}>
                    {education.map((edu, index) => (
                      <View key={index} style={{ marginBottom: '10px' }}>
                        <View style={[styles.cardBodyRow, { marginBottom: 0 }]}>
                          <Image
                            style={styles.cardBodyRowIcon}
                            src={educationIcon}
                          />
                          <Text style={styles.textWrap}>
                            <Text style={{ fontWeight: 500 }}>
                              {edu.school}
                            </Text>
                            , {edu.degree}
                          </Text>
                        </View>
                        <Text>{formatPeriod(edu.startDate, edu.endDate)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {work.length > 0 && (
                <View style={[styles.card, { paddingBottom: 0 }]}>
                  <View style={styles.cardHeader}>
                    <Text>Work experience</Text>
                  </View>
                  <View style={styles.cardBody}>
                    {work.map((w, index) => (
                      <View key={index} style={{ marginBottom: '10px' }}>
                        <View style={[styles.cardBodyRow, { marginBottom: 0 }]}>
                          <Image
                            style={styles.cardBodyRowIcon}
                            src={workIcon}
                          />
                          <Text style={styles.textWrap}>
                            <Text style={{ fontWeight: 500 }}>{w.company}</Text>
                            , {w.jobTitle}
                          </Text>
                        </View>
                        <Text>{formatPeriod(w.startDate, w.endDate)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {skills.length > 0 && (
                <View style={[styles.card, { paddingBottom: 0 }]}>
                  <View style={styles.cardHeader}>
                    <Text>Skills</Text>
                  </View>
                  <View style={styles.cardBody}>
                    {skills.map(({ skill, level }, index) => (
                      <View key={index} style={styles.cardBodyRow}>
                        <Image
                          style={styles.cardBodyRowIcon}
                          src={circleIcon}
                        />
                        <Text style={styles.textWrap}>
                          <Text style={{ fontWeight: 500 }}>{skill}</Text>,{' '}
                          {LEVELS.find((l) => l.value === level).label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    );
  }
}

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

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: '10px',
    padding: '15px 0 15px 15px',
    backgroundColor: '#fafafa',
  },
  pageBackground: {
    position: 'absolute',
    minWidth: '100%',
    minHeight: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'relative',
    padding: '35px 0',
    textAlign: 'center',
  },
  avatar: {
    marginTop: '15px',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '2px solid #f2f2f2',
    position: 'absolute',
    top: '-120px',
    left: '45px',
    objectFit: 'cover',
  },
  fullName: {
    fontSize: '24px',
    textTransform: 'uppercase',
    fontWeight: '500',
    padding: '0 10px 5px 10px',
    borderBottom: '2px solid black',
    letterSpacing: '5px',
  },
  wrapper: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    marginRight: '10px',
  },
  card: {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
    border: '2px solid #f2f2f2',
    position: 'relative',
  },
  cardHeader: {
    fontWeight: '500',
    backgroundColor: '#bbdfc8',
    textTransform: 'uppercase',
    padding: '5px',
  },
  cardBody: {
    paddingTop: '10px',
  },
  cardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardBodyRowIcon: {
    width: '10px',
    height: 'auto',
    marginRight: '5px',
  },
  textWrap: {
    flex: 1,
  },
});
