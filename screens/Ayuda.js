import React from 'react';
import { View, Text, ScrollView, StyleSheet , TouchableOpacity} from 'react-native';
import COLORS from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const Ayuda = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
         <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={28} color={COLORS.black} />
            </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <View style={styles.question}>
          <Text style={styles.questionTitle}>¿Cómo puedo cambiar la configuración de mi mascota?</Text>
          <Text style={styles.questionAnswer}>Puedes cambiar la configuración de tu mascota desde la pantalla de configuración. Simplemente ve a Configuración Mascotas y selecciona la mascota que deseas editar. Desde allí, puedes modificar la información de tu mascota, como su nombre, especie, edad, etc.</Text>
        </View>
        <View style={styles.question}>
          <Text style={styles.questionTitle}>¿Qué debo hacer si mi mascota no aparece en la lista?</Text>
          <Text style={styles.questionAnswer}>Si tu mascota no aparece en la lista de mascotas, asegúrate de haberla registrado correctamente. Ve a la pantalla de Registro de Mascotas y sigue los pasos para agregar una nueva mascota. Si el problema persiste, ponte en contacto con nuestro equipo de soporte.</Text>
        </View>
        {/* Agregar más preguntas frecuentes aquí */}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comedero GammaFeed</Text>
        <Text style={styles.comederoInfo}>El comedero GammaFeed es un dispositivo inteligente diseñado para facilitar la alimentación de tus mascotas de manera automática. Aquí tienes algunas instrucciones para utilizarlo:</Text>
        <View style={styles.comederoDetail}>
          <Text style={styles.comederoDetailTitle}>Cómo Limpiar el Comedero</Text>
          <Text style={styles.comederoDetailDescription}>Para limpiar el comedero GammaFeed, sigue estos pasos:</Text>
          <Text style={styles.comederoDetailStep}>1. Apaga el comedero y desconéctalo de la corriente.</Text>
          <Text style={styles.comederoDetailStep}>2. Retira el recipiente de comida y límpialo con agua tibia y jabón.</Text>
          <Text style={styles.comederoDetailStep}>3. Limpia el interior del comedero con un paño húmedo.</Text>
          <Text style={styles.comederoDetailStep}>4. Deja que el comedero se seque completamente antes de volver a montarlo y encenderlo.</Text>
        </View>
        {/* Agregar más detalles sobre el comedero GammaFeed aquí */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingVertical: 30,
    top: 60,
    bounces: false
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 999,
},
  section: {
    marginBottom: 30,
    top: 40
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  question: {
    marginBottom: 20,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  questionAnswer: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  comederoInfo: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 15,
  },
  comederoDetail: {
    marginBottom: 20,
  },
  comederoDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 10,
  },
  comederoDetailDescription: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  comederoDetailStep: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginLeft: 20,
    marginBottom: 5,
  },
});

export default Ayuda;
