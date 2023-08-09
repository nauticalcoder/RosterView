import { StatusBar } from 'expo-status-bar';
import { Pressable, Platform, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { Text, View } from '@/components/Themed';
import {useTeamList} from '../api/useTeamList';
import { useState } from 'react';

export default function TeamPickerModalScreen() {

  const {teams, isFetching} = useTeamList();
  const [selectedTeam, setSelectedTeam] = useState();

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

      <View style={styles.pickerContainer}>
        <Text style={styles.title}>Home Team</Text>
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
          selectedValue={selectedTeam}
          onValueChange={(itemValue, itemIndex) =>
          setSelectedTeam(itemValue)
          }>
            {
              teams?.map((team, index) =>
                <Picker.Item label={team.name} value={team.id} key={team.abbreviation} />)
            }
        </Picker>
        <View style={{
           flex: 1,
           flexDirection: 'row',
           justifyContent: 'space-evenly',
           width: '100%'
        }}>
          <Pressable>
            {({ pressed }) => (
              <Text>Select</Text>
            )}
          </Pressable>
          <Pressable>
            {({ pressed }) => (
              <Text>Cancel</Text>
            )}
          </Pressable>
        </View>
      </View>
    
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#FF0000',
    borderWidth: 5,
    width: '100%'
  },
  spinnerTextStyle: {

  }
});
