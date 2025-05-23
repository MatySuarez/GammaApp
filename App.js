import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Login, Signup, Welcome, Home, RegistroMascota, ConfiguracionComida, Api, Cuenta, Configuracion, Ayuda, BluetoothDeviceScanner } from "./screens";
import 'react-native-gesture-handler';
import { ThemeProvider } from './context/ThemeContext'; // Asegúrate de usar la ruta correcta

//import { DripsyProvider } from 'dripsy';
//import Configuracion from './screens/Configuracion'; 

const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="RegistroMascota"
          component={RegistroMascota}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="ConfiguracionComida"
          component={ConfiguracionComida}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Api"
          component={Api}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Cuenta"
          component={Cuenta}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Configuracion"
          component={Configuracion}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="Ayuda"
          component={Ayuda}
          options={{
            headerShown: false
          }}
        />
         <Stack.Screen
          name="BluetoothDeviceScanner"
          component={BluetoothDeviceScanner}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}