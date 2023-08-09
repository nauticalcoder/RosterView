import { StyleSheet } from 'react-native';
import { Text, TextProps } from './Themed';
import { FlatList, View } from '@/components/Themed';
import {Picker as DefaultPicker} from '@react-native-picker/picker';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Sean Clifford',
    number: '11',
    position: 'QB',
    schoolClass: 'SR'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Second Item',
    number: '2',
    position: 'QB',
    schoolClass: 'FR'
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Third Item',
    number: '4',
    position: 'RB',
    schoolClass: 'JR'
  },
];

type ItemProps = {name: string, number: string, position: string, schoolClass: string};
const Item = ({name, number, position, schoolClass}: ItemProps) => (
  <View style={styles.itemContainer}>
    <Text style={styles.number}>{number}</Text>
    <Text style={styles.position}>{position}</Text>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.schoolClass}>{schoolClass}</Text>
  </View>
);

type PlayerListProps = {teamId: number};
export default ({teamId} : PlayerListProps) => {
  return  <FlatList 
    data={DATA}
    renderItem={({item}) => <Item number={item.number} name={item.name} position={item.position} schoolClass={item.schoolClass} />}
    keyExtractor={item => item.id}/>;
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
    width: '76%',
  },
  number: {
    fontSize: 12,
    // fontWeight: 'bold',
    width: '8%',
  },
  position: {
    fontSize: 12,
    // fontWeight: 'bold',
    width: '8%',
  },
  schoolClass: {
    fontSize: 12,
    // fontWeight: 'bold',
    width: '8%',
  }
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: '80%',
  // },
});
