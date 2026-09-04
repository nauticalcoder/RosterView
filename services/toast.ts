import Toast from 'react-native-root-toast';

export default (
  message: string,
  duration: number = Toast.durations.SHORT,
  position: number = Toast.positions.BOTTOM,
) =>
  Toast.show(message, {
    duration,
    position,
  });
