import { StatusBar } from 'expo-status-bar';
import { Alert, Platform, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {useTeamList} from '../api/useTeamList';
import { useState } from 'react';

export default function ModalScreen() {
  // let stateType;

  // NetInfo.fetch().then(state => {
  //   console.log('Connection type', state.type);
  //   stateType = state.type;
  //   console.log('Is connected?', state.isConnected);
  // });
  const {teams, isFetching} = useTeamList();
  const [selectedHomeTeam, setSelectedHomeTeam] = useState();
  const [selectedVisitingTeam, setSelectedVisitingTeam] = useState();

  return (
    <View style={styles.container}>
      <Spinner
          //visibility of Overlay Loading Spinner
          visible={isFetching}
          //Text with the Spinner
          textContent={'Loading...'}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
      /> 
      {/* <Text style={styles.title}>Modal</Text>
      <Text style={styles.title}>{stateType}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <View style={styles.pickerContainer}>
        {/* <Text style={styles.title}>Home Team</Text> */}
        <Picker 
          style={{
            // color: '#FF0000',
            // backgroundColor: '#FFFFFF',
            width: '100%', 
          }}
          itemStyle={{
            // fontSize: 14,
            // color: '#EEEEEE',
            // backgroundColor: '#00FF00'
          }}
          selectedValue={selectedHomeTeam}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedHomeTeam(itemValue)
          }>
            {
              teams?.map((team, index) =>
                <Picker.Item label={team.name} value={team.id} key={team.abbreviation} />)
            }
        </Picker>
      </View>
      {/* <View style={styles.pickerContainer}>
        <Text style={styles.title}>Visiting Team</Text>
        <Picker
          style={{
            // width: '100%', 
            borderColor: '#00FF00',
            borderWidth: 5
          }}
          itemStyle={{
            fontSize: 14,
            color: '#EEEEEE',
          }}
          selectedValue={selectedVisitingTeam}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedVisitingTeam(itemValue)
          }>
            {
              teams?.map((team, index) =>
                <Picker.Item label={team.name} value={team.id} key={team.abbreviation}/>)
            }
      
        </Picker>
      </View> */}
      {/* <EditScreenInfo path="app/modal.tsx" /> */}

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#FF0000',
    borderWidth: 5,
    width: '100%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  spinnerTextStyle: {

  }
});
