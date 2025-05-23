import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Pressable, Alert, ScrollView, SafeAreaView , Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../constants/colors';
import { Camera } from 'expo-camera';
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, query, onSnapshot} from 'firebase/firestore';
import appFirebase from '../credenciales';
import { db } from '../credenciales';  
import { getAuth } from 'firebase/auth';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import BottomBar from '../components/BottomBar';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function RegistroMascota({ route, navigation, mascotaData, comidas }) {
   // console.log(route.params)
   //const navigation = useNavigation();
   const [isHomeScreen, setIsHomeScreen] = useState(false);
   const [isRegistroMascotaScreen, setIsRegistroMascotaScreen] = useState(true);
   const [isConfiguracionComidaScreen, setIsConfiguracionComidaScreen] = useState(false);
   const [isApiScreen, setIsApiScreen] = useState(false);
   //const [mascotaData] = useState({ nombre: '', foto: null });
  // const [comidas, setComidas] = useState([]);

    const [mascota, setMascota] = useState({
        nombre: '',
        raza: '',
        sexo: '',
        edad: '',
        peso: '',
        foto: null
    });

    useEffect(() => {
       // obtenerInformacionMascota();
       setMascota({ 
        nombre: route.params.pet.nombre,
        raza: route.params.pet.raza,
        sexo: route.params.pet.sexo,
        edad: route.params.pet.edad,
        peso: route.params.pet.peso,
        foto: route.params.pet.foto,
       })
    }, [route]);

    useEffect(() => {
        // Verifica si route.params está definido y si mascotaActualizada está presente
        if (route.params && route.params.mascotaActualizada) {
          // Obtén los datos de la mascota actualizados de los parámetros de la ruta
          const { mascotaActualizada } = route.params;
          // Actualiza el estado de la mascota con los nuevos datos
          setMascota(mascotaActualizada);
        }
      }, [route.params]);
 

    const handleInputChange = (name, value) => {
        setMascota({ ...mascota, [name]: value });
    };
   const subirImagenAFirebase = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const filename = `mascotas/${Date.now()}.jpg`; // Nombre único para la imagen
    const storageRef = ref(storage, filename);

    // Sube la imagen al storage
    await uploadBytes(storageRef, blob);

    // Obtén la URL pública de descarga
    const downloadURL = await getDownloadURL(storageRef);
    console.log("URL de la imagen subida:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};

    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            handleInputChange('foto', result.assets[0].uri);
        }
    };

    const tomarFoto = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Se necesitan permisos de cámara para usar esta función.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            handleInputChange('foto', result.assets[0].uri);
        }
    };

    const guardarDatosMascota = async () => {
      if (!mascota.nombre || !mascota.raza) {
        Alert.alert('Error', 'Por favor, completa al menos el nombre y la raza de la mascota.');
        return;
      }
    
      try {
        const auth = getAuth();
        const usuarioActual = auth.currentUser;
        const uidUsuario = usuarioActual.uid;
    
        const usuarioDocRef = doc(db, 'usuarios', uidUsuario);
        const mascotasRef = collection(usuarioDocRef, 'mascotas');
    
        const nuevaMascota = {
          nombre: mascota.nombre,
          raza: mascota.raza,
          sexo: mascota.sexo,
          edad: mascota.edad || 'N/A',
          peso: mascota.peso || 'N/A',
          foto: mascota.foto || null,
        };
    
        const mascotaDocRef = await addDoc(mascotasRef, nuevaMascota);
    
        Alert.alert('Éxito', 'Mascota guardada correctamente.');
        navigation.navigate('Home', { mascotaActualizada: { id: mascotaDocRef.id, ...nuevaMascota } });
      } catch (error) {
        console.error('Error al guardar la mascota:', error);
        Alert.alert('Error', 'No se pudo guardar la mascota.');
      }
    };
    const confirmarEliminacion = () => {
      Alert.alert(
          'Confirmar Eliminación',
          '¿Estás seguro de que deseas eliminar esta mascota?',
          [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Eliminar', onPress: eliminarMascota, style: 'destructive' }
          ]
      );
  };
    const eliminarMascota = async () => {
      try {
          const auth = getAuth();
          const usuarioActual = auth.currentUser;
          const uidUsuario = usuarioActual.uid;

          const usuarioDoc = doc(collection(db, 'usuarios'), uidUsuario);
          const mascotaDoc = doc(collection(usuarioDoc, 'mascotas'), uidUsuario);

          await deleteDoc(mascotaDoc);

          Alert.alert('Éxito', 'Mascota eliminada correctamente.');
          navigation.navigate('Home');
      } catch (error) {
          console.error('Error al eliminar la mascota:', error);
          Alert.alert('Error', 'No se pudo eliminar la mascota.');
      }
  };
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={ styles.contentContainerStyle}>
            <TouchableOpacity onPress={confirmarEliminacion} style={styles.trashIcon}>
                        <Icon name="trash" size={24} color="red" />
                    </TouchableOpacity>
                <Text style={styles.title}>Registro de Mascota</Text>
                <View style={styles.conteinerFoto}>
                {mascota.foto && <Image style={styles.image} source={{ uri: mascota.foto }} />}
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={mascota.nombre}
                    onChangeText={(text) => handleInputChange('nombre', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Raza"
                    value={mascota.raza}
                    onChangeText={(text) => handleInputChange('raza', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Sexo"
                    value={mascota.sexo}
                    onChangeText={(text) => handleInputChange('sexo', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Edad"
                    value={mascota.edad}
                    onChangeText={(text) => handleInputChange('edad', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Peso"
                    value={mascota.peso}
                    onChangeText={(text) => handleInputChange('peso', text)}
                />
                <View style={styles.buttonContenedor}>
                <Pressable style={styles.button2} onPress={seleccionarImagen}>
                    <Icon name='picture-o' size={22} color="white" />
                    <Text style={styles.buttonText}>  Seleccionar Imagen</Text>
                </Pressable>
                <Pressable style={styles.button2} onPress={tomarFoto}>
                    <Icon name='camera' size={22} color="white" />
                    <Text style={styles.buttonText}>  Tomar Foto</Text>
                </Pressable>
                </View>
                <TouchableOpacity onPress={guardarDatosMascota} style={styles.button}>
                    <Text style={styles.buttonText}>Guardar Mascota</Text>
                </TouchableOpacity>
               
            </ScrollView>
           
     <View style={styles.bottomBarContainer}> 
       <BottomBar
        navigation={navigation}
        isHomeScreen={false}
        isRegistroMascotaScreen={true}
        isConfiguracionComidaScreen={false}
        isApiScreen={false}
        mascotaData={mascotaData}
        comidas={comidas}
        route={route}
      />
      </View> 
        </SafeAreaView>
    );
};
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    contentContainerStyle: {
      flex: 1,
      padding: width * 0.020,
      bounces: false
    },
    title: {
      fontSize: width * 0.061,
      fontWeight: 'bold',
      marginVertical: height * 0.014,
      textAlign: 'center'
    },
    input: {
      top: height * 0.01,
      backgroundColor: '#fff',
      borderColor: COLORS.primary,
      borderWidth: 2,
      //fontWeight: 'bold',
      fontSize: width * 0.025,
      // width: '80%',
      // left: 45,
      padding: width * 0.036,
      borderRadius: width * 0.036,
      marginVertical: height * 0.007,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    buttonContenedor: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignContent: 'space-between',

    },
    button2: {
        margin: width * 0.04,
        top: height * 0.01,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.4,
        height: height * 0.07,
        alignSelf:'center',
        paddingVertical: height * 0.014,
        backgroundColor: COLORS.primary,
        borderRadius: width * 0.036,
        marginBottom: height * 0.007,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
      },
    button: {
      top: height * 0.01,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 0.9,
      height: height * 0.07,
      alignSelf:'center',
      paddingVertical: height * 0.014,
      backgroundColor: COLORS.primary,
      borderRadius: width * 0.036,
      marginBottom: height * 0.007,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },
    trashIcon: {
      alignSelf: 'flex-end',
      marginEnd: width * 0.03
    },

    
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: width * 0.027,
    },
    icono: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
   
    image: {
      width: width * 0.52,
      height: height * 0.23,
      resizeMode: 'cover',
      marginBottom: height * 0.007,
      borderTopLeftRadius: width * 0.09,
      borderBottomRightRadius: width * 0.09,
      alignSelf:'center'  
    },
    conteinerFoto: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    bottomBarContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      },
  });
  
