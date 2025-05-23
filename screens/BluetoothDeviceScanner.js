import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
//import { BleManager } from 'react-native-ble-plx';
//import { requestPermissionsAsync } from 'expo-bluetooth';

//const manager = new BleManager();

const BluetoothDeviceScanner = ({ navigation }) => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const response = await requestPermissionsAsync();
      if (!response.granted) {
        console.error('Bluetooth permissions not granted');
      }
    };

    requestPermissions();

    return () => {
      if (scanning) {
        stopScan();
      }
      manager.destroy();
    };
  }, []);

  const startScan = () => {
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error during scan:', error);
        setScanning(false);
        return;
      }

      if (device && !devices.some(d => d.id === device.id)) {
        setDevices(prevDevices => [...prevDevices, device]);
      }
    });

    setTimeout(() => {
      stopScan();
    }, 10000); // Detener el escaneo después de 10 segundos
  };
  const stopScan = () => {
    setScanning(false);
    manager.stopDeviceScan();
  };

  const connectToDevice = async (device) => {
    try {
      await manager.connectToDevice(device.id);
      console.log('Connected to device:', device.name || 'Unnamed Device');
      // Aquí puedes realizar acciones adicionales, como enviar o recibir datos.
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  return (
    <View>
      <Text>Dispositivos Bluetooth</Text>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => connectToDevice(item)}>
            <Text>{item.name || 'Unnamed Device'}</Text>
          </TouchableOpacity>
        )}
      />
      <Button
        title={scanning ? 'Stop Scan' : 'Start Scan'}
        onPress={scanning ? stopScan : startScan}
      />
    </View>
  );
};

export default BluetoothDeviceScanner;

