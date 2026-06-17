import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/app/navigation';
import { AppProviders } from './src/app/providers';

export default function App() {
  return (
    <AppProviders>
      <AppNavigator />
      <StatusBar style="auto" />
    </AppProviders>
  );
}
