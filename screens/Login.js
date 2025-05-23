import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from '../components/Button';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import appFirebase from '../credenciales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';

// Completa el flujo de redirección de la sesión
WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Firebase instances
  const auth = getAuth(appFirebase);
  const db = getFirestore(appFirebase);

  // Configuración de Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '533558155503-tc1bcaqsgbl2v9au2pu2aa6c2k7c4mvn.apps.googleusercontent.com', // Tu Client ID
    redirectUri: makeRedirectUri({
      scheme: 'exp', // Cambia el esquema si estás en producción
    }),
  });

  // Cargar el email al iniciar el componente
  useEffect(() => {
    const loadEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Failed to load the email from storage', error);
      }
    };

    loadEmail();
  }, []);

  // Manejo del inicio de sesión con Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Guardar información en Firestore si es un nuevo usuario
          const userDoc = doc(db, 'usuarios', user.uid);
          await setDoc(userDoc, {
            uid: user.uid,
            email: user.email,
            nickname: user.displayName || 'Usuario Google',
          });

          Alert.alert('Inicio de sesión exitoso', '¡Bienvenido!');
          navigation.navigate('Home');
        })
        .catch((error) => {
          console.error('Error con Google Sign-In:', error);
          Alert.alert('Error', 'No se pudo iniciar sesión con Google.');
        });
    }
  }, [response]);

  // Función para manejar el inicio de sesión con correo y contraseña
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate('Home');
        if (isChecked) {
          storeEmail(email);
        }
      })
      .catch((error) => {
        console.error('Error al autenticar:', error);
        Alert.alert('Error de Login', 'No se pudo iniciar sesión, verifica tus credenciales.');
      });
  };

  const storeEmail = async (email) => {
    try {
      await AsyncStorage.setItem('userEmail', email);
    } catch (error) {
      console.error('Failed to save the email to storage', error);
    }
  };

  const handlePasswordReset = () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert('Correo enviado', 'Se ha enviado un enlace de restablecimiento a tu correo.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de restablecimiento:', error);
        Alert.alert('Error', 'No se pudo enviar el correo. Revisa la dirección.');
      });
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Welcome')}
          style={{
            position: 'absolute',
            top: 10,
            zIndex: 999,
          }}
        >
          <Ionicons name="arrow-back" size={26} color={COLORS.black} />
        </TouchableOpacity>
        <View style={{ marginVertical: 22 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginVertical: 22, color: COLORS.black, top: 10 }}>
            Hola Bienvenido! 👋
          </Text>
          <Text style={{ fontSize: 16, color: COLORS.black, top: 10 }}>Hola de nuevo, te extrañamos!</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Email </Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Ingresa tu email "
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: '100%',
              }}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Password</Text>
          <View
            style={{
              width: '100%',
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Ingresa tu password"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={{
                width: '100%',
              }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 12,
              }}
            >
              {isPasswordShown ? (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginVertical: 6 }}>
          <Checkbox
            style={{ marginRight: 8 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />
          <Text>Recordarme</Text>
        </View>

        <Button title="Login" filled onPress={handleLogin} style={{ marginTop: 18, marginBottom: 4 }} />

        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Pressable onPress={handlePasswordReset}>
            <Text style={{ color: COLORS.violet, fontSize: 16 }}>¿Olvidaste tu contraseña?</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey, marginHorizontal: 10 }} />
          <Text style={{ fontSize: 14 }}>O Logueate con</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey, marginHorizontal: 10 }} />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => promptAsync()} // Inicia la autenticación con Google
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              height: 52,
              borderWidth: 1,
              borderColor: COLORS.grey,
              marginRight: 4,
              borderRadius: 10,
            }}
          >
            <Image
              source={require('../assets/google.png')}
              style={{
                height: 36,
                width: 36,
                marginRight: 8,
              }}
              resizeMode="contain"
            />
            <Text>Google</Text>
          </TouchableOpacity>
        </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>No tienes una cuenta ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Registrarse</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Login;
