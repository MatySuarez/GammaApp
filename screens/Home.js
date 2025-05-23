import React from 'react';
import { StatusBar } from 'react-native';
import { useState , useEffect} from 'react'
import { View, Text, Image, Pressable, TextInput, TouchableOpacity, ScrollView, Modal, TouchableHighlight, Dimensions } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { StyleSheet } from 'react-native';
import Button from '../components/Button';
import { Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de instalar esta librería
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, onSnapshot} from 'firebase/firestore';
import { db } from '../credenciales'; 
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import BottomBar from '../components/BottomBar';
//import BluetoothDeviceScanner from '../screens/BluetoothDeviceScanner';

//import { Bluetooth } from 'expo-bluetooth';
//import { Bluetooth } from 'react-native-web-bluetooth';




const Home = ({route, navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userDropdownVisible, setUserDropdownVisible] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');
  const [mascotaData, setMascotaData] = useState({ nombre: '', foto: null });
  const [comidas, setComidas] = useState([]);
  const [uidUsuario, setUidUsuario] = useState(null); // Estado para almacenar el UID del usuario
  const auth = getAuth();
  const usuarioActual = auth.currentUser;
  const [mascota, setMascota] = useState({ nombre: '', foto: null });
  const [isHomeScreen, setIsHomeScreen] = useState(true);
  const [isRegistroMascotaScreen, setIsRegistroMascotaScreen] = useState(false);
  const [isConfiguracionComidaScreen, setIsConfiguracionComidaScreen] = useState(false);
  const [isApiScreen, setIsApiScreen] = useState(false);
  
 // Función para obtener el nombre del usuario actualmente autenticado
 const obtenerNombreUsuario = async () => {
  const auth = getAuth();
  const usuarioActual = auth.currentUser;
  if (usuarioActual) {
      const db = getFirestore();
      const q = query(collection(db, 'usuarios'), where('uid', '==', usuarioActual.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
          setUserDisplayName(doc.data().nickname);
      });
      setUserDropdownVisible(false);

  }
};
//533558155503-tc1bcaqsgbl2v9au2pu2aa6c2k7c4mvn.apps.googleusercontent.com

const obtenerInformacionMascota = async () => {
  const auth = getAuth();
  const usuarioActual = auth.currentUser;
  if (usuarioActual) {
    try {
      const mascotasRef = collection(db, 'usuarios', usuarioActual.uid, 'mascotas');
      const querySnapshot = await getDocs(mascotasRef);
      
      if (!querySnapshot.empty) {
        const mascota = querySnapshot.docs[0].data(); // Obtener la primera mascota
        setMascotaData({
          nombre: mascota.nombre || 'Sin nombre',
          foto: mascota.foto || null, // Asegúrate de manejar el caso donde no haya foto
        });
      } else {
        console.warn("No se encontraron mascotas para este usuario.");
        setMascotaData({ nombre: "Sin mascotas", foto: null });
      }
    } catch (error) {
      console.error('Error al obtener la información de la mascota:', error);
    }
  } else {
    console.log('No hay usuario autenticado.');
  }
};
/*
const buscarDispositivosBluetooth = async () => {
  try {
    const dispositivos = await Bluetooth.getDevicesAsync();
    console.log('Dispositivos Bluetooth encontrados:', dispositivos);
    // Aquí podrías mostrar los dispositivos encontrados en una lista o modal
  } catch (error) {
    console.error('Error al buscar dispositivos Bluetooth:', error);
  }
};
*/
 const handleUserDropdownClose = () => {
    setUserDropdownVisible(false);
  };

  const handleCloseDropdown = () => {
    setDropdownVisible(false);
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleCloseDropdown();
    });
  
    return unsubscribe;
  }, [navigation]);

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    handleUserDropdownClose();
  });

  return unsubscribe;
}, [navigation]);

useEffect(() => {
  if (route.params && route.params.mascotaActualizada) {
    const { mascotaActualizada } = route.params;
    setMascotaData(mascotaActualizada);
  }
}, [route.params]);

useEffect(() => {
  const auth = getAuth();
  const usuarioActual = auth.currentUser;

  // Verificar si hay un usuario autenticado
  if (usuarioActual) {
    const uid = usuarioActual.uid;
    setUidUsuario(uid); // Establecer el UID del usuario en el estado
  } else {
    console.log('No hay usuario autenticado');
  }
}, []);

const getComidasFromDatabase = () => {
  try {
    const mascotaComidasRef = collection(db, `usuarios/${uidUsuario}/mascotas/${uidUsuario}/comidas`);
    return mascotaComidasRef;
  } catch (error) {
    console.error('Error al obtener las comidas:', error);
    // Devuelve una referencia a una colección vacía en caso de error
    return collection(db, 'comidas');
  }
};

// Obtener las comidas desde la base de datos y mostrarlas por console.log
const obtenerComidas = async () => {
  const comidasRef = getComidasFromDatabase();
  const unsubscribe = onSnapshot(comidasRef, (snapshot) => {
    const comidasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
   // console.log('Comidas:', comidasData);
  });
};
// Llamar a la función para obtener las comidas
obtenerComidas();


    const handleLogout = () => {
      Alert.alert(
        "Cerrar Sesión", // Título del cuadro de diálogo
        "¿Estás seguro de que quieres cerrar sesión?", // Mensaje del cuadro de diálogo
        [
          {
            text: "Cancelar",
            onPress: () => console.log("Cancelado"),
            style: "cancel"
          },
          { 
            text: "OK", 
            onPress: () => {
              // Aquí va el código para manejar el cierre de sesión
              // Por ejemplo, limpiar el estado del usuario o eliminar tokens
              console.log("Cerrando sesión");
              navigation.navigate("Welcome"); // Asumiendo que "Welcome" es el nombre de tu pantalla de bienvenida
              setUserDropdownVisible(false);

            }
          }
        ],
        { cancelable: false } // Esto hace que sea necesario seleccionar una opción para cerrar el cuadro de diálogo
      );
    };
    useEffect(() => {
      obtenerNombreUsuario();
      obtenerInformacionMascota();
      getComidasFromDatabase();
    }, []);

    return (
        
      <View style={styles.container}>
         <StatusBar
       
        barStyle="dark-content" // Texto claro para iOS y Android
      />
        {/* Barra superior con iconos */}
        <View style={styles.topBar}>
  <TouchableOpacity style={styles.iconButton} onPress={() => setUserDropdownVisible(!userDropdownVisible)}>
    <Icon name="user-circle-o" size={40} color='black'/>
  </TouchableOpacity>
  <TouchableOpacity style={styles.iconButton} onPress={() => setDropdownVisible(!dropdownVisible)}>
    <Icon name="plus-circle" size={43} color={COLORS.primary}/>
  </TouchableOpacity>
</View>

{/* Desplegable para el ícono de usuario */}
{userDropdownVisible && (
  <View style={styles.dropdown}>
    <TouchableOpacity onPress={() => navigation.navigate('Cuenta')} style={styles.separador}>
      <Text style={styles.dropdownText}><Icon name="user" size={16} color="black"/>      Perfil</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Configuracion')} style={styles.separador}>
      <Text style={styles.dropdownText}><Icon name="cog" size={16} color="black"/>     Configuración</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate('Ayuda')} style={styles.separador}>
      <Text style={styles.dropdownText}><Icon name="info-circle" size={16} color="black"/>     Ayuda</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleLogout} style={styles.separador1}>
      <Text style={[styles.dropdownText, style={color: 'red'}]}>  <Icon name="sign-out" size={16} color="red"/>    Cerrar sesión</Text>
    </TouchableOpacity>
  </View>
)}

{/* Desplegable para el ícono plus-circle */}
{dropdownVisible && (
  <View style={styles.dropdown2}>
    <TouchableOpacity onPress={() => console.log('Agregar dispositivo')} style={styles.separador}>
      <Text style={styles.dropdownText2}><Icon name="plug" size={16} color="black"/>     Agregar dispositivo</Text>
    </TouchableOpacity>
   <TouchableOpacity onPress={() => console.log('Leer codigo QR')} style={[styles.separador1]}>
      <Text style={styles.dropdownText2}>  <Icon name="qrcode" size={16} color="black"/>       Leer codigo QR</Text>
    </TouchableOpacity>
    
  </View>
)}


 <View style={styles.centerContent}>
    <Text style={styles.messageText}>      Hola, {userDisplayName}  👋</Text>
    <View style={styles.conteinerFoto}>

    {mascotaData.foto && (
        <Image source={{ uri: mascotaData.foto }} style={styles.mascotaFoto} />
    )}
    </View>
    <TouchableOpacity style={styles.boton}>
    <Text style={styles.mascotaNombre}>{mascotaData.nombre}</Text>
    </TouchableOpacity>
</View>

<BottomBar
        navigation={navigation}
        isHomeScreen={true}
        isRegistroMascotaScreen={false}
        isConfiguracionComidaScreen={false}
        isApiScreen={false}
        mascotaData={mascotaData}
        comidas={comidas}
        route={route}
      />
      </View>
    );
  };
  
  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      backgroundColor: '#fffff0'
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: width * 0.02,
      top: height * 0.05
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      top: height * 0.05,
      marginBottom: height * 0.08
    },
    iconButton: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25, 
      elevation: 5,
      padding: width * 0.03,
      margin: -5,
    },
   
    boton: {
      top: height * 0.02,
      borderTopLeftRadius: width * 0.09,
      borderBottomRightRadius: width * 0.09,
      padding: width * 0.02,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: height * 0.01,
      backgroundColor: COLORS.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 5,
      width: width * 0.5,
      height: height * 0.1,
      justifyContent: 'center',
      borderWidth : width * 0.005,
      borderColor : COLORS.violet
    },
    textboton: {
      color: '#FFFFFF',
      fontSize: width * 0.036
    },
    messageText: {
      fontSize: width * 0.027,
      marginBottom: height * 0.025
    },
   
    dropdown: {
      backgroundColor: '#c0c0c0',
      position: 'absolute',
      top: height * 0.125,
      right: width * 0.370,
      width: width * 0.55,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
      zIndex: 1000,
      borderRadius: 8,
    },
    dropdownText: {
      padding: width * 0.025,
      fontSize: width * 0.03,
      color: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      fontWeight: 'bold',
    },
    dropdown2: {
      backgroundColor: '#c0c0c0',
      //backgroundColor: 'rgba(0, 0, 0, 0.6)',
      position: 'absolute',
      top: height * 0.125,
      right: width * 0.08,
      width: width * 0.55,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderRadius: 8,
      zIndex: 900,
    },
    dropdownText2: {
      padding: width * 0.025,
      fontSize: width * 0.025,
      color: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      left: width * 0.010,
      fontWeight: 'bold',

    },
    separador: {
      borderBottomWidth: 1,
      borderBottomColor: '#a9a9a9',
      width: width * 0.5,
      alignSelf: 'center'
    },
    separador1: {
      left: width * 0.01
    },
    messageText: {
      top: -height * 0.05,
      alignItems: 'center',
      marginTop: height * 0.04,
      fontSize: width * 0.09,
      fontWeight: '700',
    },
    conteinerFoto: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      
    },
    mascotaFoto: {
      width: width * 0.55,
      height: width * 0.55,
      borderTopLeftRadius: width * 0.1,
      borderBottomRightRadius: width * 0.1,
      marginTop: -width * 0.040,
    },
    mascotaNombre: {
      fontSize: width * 0.09,
      marginTop: height * 0.05,
      fontWeight: 'bold',
      fontStyle: 'italic',
      color: COLORS.black,
      paddingBottom: height * 0.11,
      
    }
  });
  
  
  export default Home;
