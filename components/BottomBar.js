import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de importar esta librería
import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const BottomBar = ({ navigation, isHomeScreen, isRegistroMascotaScreen, isConfiguracionComidaScreen, isApiScreen, mascotaData, comidas, route }) => {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Home")}>
        <Icon name="home" size={30} color={isHomeScreen ? COLORS.primary : "black"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("RegistroMascota", { pet: mascotaData || route.params.pet, comidas: comidas || route.params.comidas })}>
        <Icon name="paw" size={30} color={isRegistroMascotaScreen ? COLORS.primary : "black"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("ConfiguracionComida", { pet: mascotaData || route.params.pet, comidas: comidas || route.params.comidas })}>
        <Icon name="cutlery" size={30} color={isConfiguracionComidaScreen ? COLORS.primary : "black"} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Api", { pet: mascotaData || route.params.pet, comidas: comidas || route.params.comidas })}>
        <Icon name="external-link-square" size={30} color={isApiScreen ? COLORS.primary : "black"} />
      </TouchableOpacity>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    icono: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5
      },
      bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10, // Usar un valor fijo para el relleno vertical
        paddingHorizontal: 20, // Usar un valor fijo para el relleno horizontal
        position: 'absolute', // Posicionamiento absoluto para fijar el BottomBar en la parte inferior
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#dcdcdc',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        height: 80, // Altura fija para el BottomBar
        zIndex: 1000, // Asegura que esté por encima del contenido
      },
      
});


export default BottomBar;

