import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import PlayerList from '../../components/PlayerList';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Sean Clifford',
    number: '11',
    position: 'QB',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Second Item',
    number: '2',
    position: 'QB',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Third Item',
    number: '4',
    position: 'RB',
  },
];

// type ItemProps = {name: string, number: string, position: string};

// const Item = ({name, number, position}: ItemProps) => (
//   <View style={styles.itemContainer}>
//     <Text style={styles.number}>{number}</Text>
//     <Text style={styles.name}>{name}</Text>
//     <Text style={styles.position}>{position}</Text>
//   </View>
// );

export default function HomeTeamScreen() {
  return (
    <View style={styles.container}>
      <PlayerList teamId={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 2,
    marginVertical: 2,
    marginHorizontal: 15,
  },
  
  item: {
    // backgroundColor: '#00ff00',
    padding: 2,
    marginVertical: 5,
    marginHorizontal: 5,
    width: 100,
  },

  name: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '80%',
  },
  number: {
    fontSize: 12,
    // fontWeight: 'bold',
    width: '10%',
  },
  position: {
    fontSize: 12,
    // fontWeight: 'bold',
    width: '10%',
  },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: '80%',
  // },
});
