import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert, StyleSheet, Platform , Dimensions, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection, doc, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../credenciales'; 
import { getAuth } from 'firebase/auth';
import BottomBar from '../components/BottomBar';

const ConfiguracionComida = ({route, navigation, mascotaData }) => {
  const [comidas, setComidas] = useState(route.params.pet?.comidas || []);
  const [nuevaComida, setNuevaComida] = useState({ horario: new Date(), cantidad: '200' });
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCantidadPicker, setShowCantidadPicker] = useState(false);
   // const [showSelectors, setShowSelectors] = useState(false);
    const auth = getAuth();
    const usuarioActual = auth.currentUser;
    const uidUsuario = usuarioActual.uid;
    const [isHomeScreen, setIsHomeScreen] = useState(false);
    const [isRegistroMascotaScreen, setIsRegistroMascotaScreen] = useState(false);
    const [isConfiguracionComidaScreen, setIsConfiguracionComidaScreen] = useState(true);
    const [isApiScreen, setIsApiScreen] = useState(false);



useEffect(() => {
   // console.log(route.params.comidas)
    setComidas(route.params.comidas);
  }, [route.params.comidas]);
  

useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, `usuarios/${uidUsuario}/mascotas/${uidUsuario}/comidas`), (snapshot) => {
      const comidasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComidas(comidasData);
    });
  
    return () => unsubscribe();
  }, [uidUsuario]);

  const agregarComida = async () => {
    if (!nuevaComida.horario || !nuevaComida.cantidad) {
        Alert.alert("Error", "Selecciona una hora y cantidad antes de agregar.");
        return;
    }

    if (!uidUsuario ) {
        console.error("Faltan datos necesarios: UID del usuario o ID de la mascota.");
        Alert.alert("Error", "No se pudo agregar la comida porque faltan datos necesarios.");
        return;
    }

    try {
        const comidaData = {
            horario: nuevaComida.horario.getTime(),
            cantidad: parseFloat(nuevaComida.cantidad),
            tipo: "Comida Normal",
        };

        // Referencia al documento de la mascota
        const usuarioRef = doc(db, "usuarios", uidUsuario);
        const mascotaRef = doc(usuarioRef, "mascotas", uidUsuario);
        const comidasRef = collection(mascotaRef, "comidas");

        // Crear la nueva comida
        const docRef = await addDoc(comidasRef, comidaData);

        console.log("Comida agregada con éxito:", docRef.id);

        // Actualizar el estado local
        setComidas([...comidas, { id: docRef.id, ...comidaData }]);

        Alert.alert("Éxito", "Comida agregada correctamente.");
    } catch (error) {
        console.error("Error al agregar la comida:", error.message);
        Alert.alert("Error", "No se pudo agregar la comida. Verifica tu conexión o configuración.");
    }
};

const agregarComidaEmergencia = async () => {
  if (!uidUsuario) {
    console.error("UID Usuario no definido");
    Alert.alert("Error", "El usuario no está autenticado.");
    return;
  }

  try {
    const comidaData = {
      horario: Date.now(),
      cantidad: 200, // Asegurarse de que sea un número
      tipo: "Comida de Emergencia",
    };

    const usuarioRef = doc(db, "usuarios", uidUsuario);
    const mascotaRef = doc(usuarioRef, "mascotas", uidUsuario);
    const comidasRef = collection(mascotaRef, "comidas");

    const docRef = await addDoc(comidasRef, comidaData);

    console.log("Comida de emergencia agregada con éxito:", docRef.id);

    setComidas([...comidas, { id: docRef.id, ...comidaData }]);
  } catch (error) {
    console.error("Error al agregar comida de emergencia:", error.message);
    Alert.alert("Error", "No se pudo agregar la comida de emergencia. Verifica tu conexión o configuración.");
  }
};


  const eliminarComida = async (id, index) => {
    Alert.alert("Eliminar Comida", "¿Estás seguro de que deseas eliminar esta comida?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", onPress: async () => {
    try {
        await deleteDoc(doc(db, `usuarios/${uidUsuario}/mascotas/${uidUsuario}/comidas`, id));
        const nuevasComidas = [...comidas];
        nuevasComidas.splice(index, 1);
        setComidas(nuevasComidas);
      //  Alert.alert('Éxito', 'Comida eliminada correctamente.');
    } catch (error) {
        console.error('Error al eliminar la comida:', error);
        Alert.alert('Error', 'No se pudo eliminar la comida.');
    }
  }},
]);
};



    const onChangeTime = (event, selectedDate) => {
        const currentDate = selectedDate || nuevaComida.horario;
        setShowTimePicker(Platform.OS === 'ios'); // Hide on iOS after selection
        setNuevaComida({...nuevaComida, horario: currentDate});
    };
    const onChangeCantidad = (itemValue) => {
      setNuevaComida((prev) => ({ ...prev, cantidad: itemValue }));
  };

    const togglePicker = (picker) => {
        if (picker === 'time') {
            setShowTimePicker(!showTimePicker);
            setShowCantidadPicker(false);
        } else {
            setShowCantidadPicker(!showCantidadPicker);
            setShowTimePicker(false);
        }
    };

    return (
      <SafeAreaView style={styles.safeArea}>
         <TouchableOpacity onPress={() => agregarComidaEmergencia()} style={styles.button4}>
                    <Text style={styles.buttonText}>Comida de emergencia</Text>
                </TouchableOpacity>
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Configuración de Comida</Text>
                {comidas?.map((comida, index) => (
                  <View key={comida.id} style={styles.comidaContainer}>
                     <Text style={styles.comidaTitle}>
                             {comida.tipo === 'Comida de Emergencia' 
                               ? comida.tipo 
                               : `Comida ${index + 1}`}
                           </Text>                  
                  <Text style={styles.comidaInfo}>Horario: {new Date(comida.horario).toLocaleString()}</Text>
                  <Text style={styles.comidaInfo2}>Cantidad: {comida.cantidad} gramos</Text>
                  <TouchableOpacity onPress={() => eliminarComida(comida.id, index)} style={styles.deleteButton}>
                      <Icon name="trash" size={20} color="red" />
                  </TouchableOpacity>
              </View>
              
))}

                <View style={styles.selector}>
                    <TouchableOpacity onPress={() => togglePicker('time')} style={styles.button}>
                        <Text style={styles.buttonText}>Seleccionar Horario</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => togglePicker('cantidad')} style={styles.button}>
                        <Text style={styles.buttonText}>Seleccionar Cantidad</Text>
                    </TouchableOpacity>
                </View>

                {showTimePicker && (
                    <Modal transparent={false} visible={showTimePicker} animationType="slide" onRequestClose={() => togglePicker('time')}>
                        <View style={styles.centeredView}>
                            <DateTimePicker value={nuevaComida.horario} mode="time" display="default" onChange={onChangeTime} />
                            <TouchableOpacity  onPress={() => togglePicker('time')} style={styles.button3} >
                                <Text>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                )}

                {showCantidadPicker && (
                    <Modal transparent={false} visible={showCantidadPicker} animationType="slide" onRequestClose={() => togglePicker('cantidad')}>
                    <View style={styles.centeredView}>
                        <Picker
                            selectedValue={nuevaComida.cantidad}
                            style={{ width: 250, height: 180 }}
                            onValueChange={onChangeCantidad} // Actualizamos cantidad aquí
                        >
                            {[...Array(20).keys()].map(i => (
                                <Picker.Item key={i} label={`${(i + 1) * 50} gramos`} value={`${(i + 1) * 50}`} />
                            ))}
                        </Picker>
                        <TouchableOpacity onPress={() => togglePicker('cantidad')} style={styles.button3}>
                            <Text>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                )}

                <TouchableOpacity onPress={ agregarComida} style={styles.button2}>
                    <Text style={styles.buttonText}>Agregar Comida</Text>
                </TouchableOpacity>
               
            </ScrollView>
        <View style={styles.bottomBarContainer}> 
       <BottomBar
        navigation={navigation}
        isHomeScreen={false}
        isRegistroMascotaScreen={false}
        isConfiguracionComidaScreen={true}
        isApiScreen={false}
        mascotaData={mascotaData}
        comidas={comidas}
        route={route}
      />
      </View> 
        </View>
        </SafeAreaView>
    );
};
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
    container: {
      flex: 1,
      padding: width * 0.020,
      bounces: false
      },
      title: {
        marginTop: height * 0.03,
        fontSize: width * 0.055,
        fontWeight: 'bold',
        marginVertical: height * 0.014,
        textAlign: 'center'
      },
      comidaContainer: {
        flexDirection: 'column',
        //flexWrap: 'wrap',
       // justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: width * 0.027,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: width * 0.036,
        marginBottom: height * 0.008,
      },
      comidaTitle: {
        fontWeight: 'bold',
        fontSize: width * 0.041,
        marginBottom: height * 0.007,
        //left: width * 0.304

      },
      comidaInfo: {
        fontSize: width * 0.038,
        left: width * 0.224

      },
      comidaInfo2: {
        fontSize: width * 0.038,
        left: width * 0.224
      },
      selector: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
      },
      button: {
        top: height * 0.02,
        backgroundColor: COLORS.primary,
        padding: width * 0.025,
        borderRadius: width * 0.036,
        alignItems: 'center',
        marginBottom: height * 0.0012,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
      },
      button2: {
        top: height * 0.03,
        backgroundColor: COLORS.primary,
        padding: width * 0.03,
        borderRadius: width * 0.036,
        alignItems: 'center',
        marginBottom: height * 0.007,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        width: width * 0.91,
        left: width * 0.018
      },
      button3: {
        top: height * 0.04,
        padding: width * 0.036,
        borderRadius: width * 0.036,
        alignItems: 'center',
        marginBottom: height * 0.007,
        backgroundColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
      },
      button4: {
        top: height * 0.03,
        backgroundColor: COLORS.violet,
        padding: width * 0.036,
        borderRadius: width * 0.036,
        alignItems: 'center',
        marginBottom: height * 0.007,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
        width: width * 0.91,
        left: width * 0.042
      },
      buttonText: {
        color: 'white',
        fontSize: width * 0.044
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.126,
        backgroundColor: 'rgba(0, 0, 0, 0.4)'  
      },
      deleteButton: {
        alignSelf: 'flex-end',
        marginTop: height * 0.009
      },
      bottomBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -30,
      },
    });
    
    

export default ConfiguracionComida;
