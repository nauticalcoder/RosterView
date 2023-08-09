import Toast from 'react-native-root-toast';


export default (message: string, duration: number = Toast.durations.SHORT, position: number = Toast.positions.BOTTOM) => Toast.show('message', {
  duration: Toast.durations.LONG,
  position
});

// export default (message: string, duration: number = Toast.SHORT, gravity: number = Toast.BOTTOM) =>
//   Toast.showWithGravity(message, duration, gravity, ['RCTModalHostViewController']);
