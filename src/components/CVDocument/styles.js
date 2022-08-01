import { StyleSheet } from '@react-pdf/renderer';

export default StyleSheet.create({
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
    marginRight: '10px',
    padding: '25px 0',
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
    left: '37.5px',
    objectFit: 'cover',
  },
  fullName: {
    fontSize: '24px',
    textTransform: 'uppercase',
    fontWeight: '500',
    padding: '0 10px 5px 10px',
    borderBottom: '2px solid black',
    letterSpacing: '2.5px',
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
    padding: '10px 10px 0 10px',
    borderRadius: '5px',
    position: 'relative',
  },
  cardBackgroundImage: {
    position: 'absolute',
    opacity: 0.1,
    top: '1px',
    left: '1px',
    bottom: 0,
    right: 0,
    minWidth: '100%',
    minHeight: '100%',
    borderRadius: '5px',
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
  link: {
    color: 'black',
  },
  list: {
    margin: '5px 0 0 5px',
    flexDirection: 'column',
  },
  listItem: {
    marginBottom: '5px',
  },
  listItemText: {
    fontSize: 10,
  },
});
