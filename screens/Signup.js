import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from '../components/Button';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app'; 
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';import { db } from '../credenciales';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
    apiKey: "AIzaSyAgmUh1qk15MQZHv6FgDQ37qcuLpsEhITI",
    authDomain: "gammafeed-93110.firebaseapp.com",
    projectId: "gammafeed-93110",
    storageBucket: "gammafeed-93110.appspot.com",
    messagingSenderId: "533558155503",
    appId: "1:533558155503:web:37a29e59f64dce94bda31a"
};

// Inicializa la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Auth con la persistencia adecuada
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '533558155503-tc1bcaqsgbl2v9au2pu2aa6c2k7c4mvn.apps.googleusercontent.com', 
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
    
            const credential = GoogleAuthProvider.credential(id_token);
    
            signInWithCredential(auth, credential)
                .then(async (userCredential) => {
                    const user = userCredential.user;
    
                    // Usar `setDoc` para mantener el UID como ID del documento
                    const userDocRef = doc(db, 'usuarios', user.uid);
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        email: user.email,
                        nickname: user.displayName || 'Usuario de Google',
                    });
    
                    Alert.alert('Registro exitoso', '¡Bienvenido a GammaApp!');
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    console.error('Error al iniciar sesión con Google:', error);
                    Alert.alert('Error', 'No se pudo completar el registro con Google.');
                });
        }
    }, [response]);

    const handleSignup = async () => {
        if (!isChecked) {
            Alert.alert('Error', 'Debes aceptar los términos y condiciones para registrarte.');
            return;
        }
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            await sendEmailVerification(user);
    
            // Usar `setDoc` para crear el documento con el UID del usuario como ID
            const userDocRef = doc(db, 'usuarios', user.uid); // Esto requiere importar `doc` correctamente
            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                nickname: nombre,
            });
    
            Alert.alert(
                'Usuario creado correctamente!',
                'Por favor verifica tu correo electrónico antes de iniciar sesión.'
            );
            navigation.navigate('Welcome');
        } catch (error) {
            console.error('Error al crear usuario y/o guardar en Firestore:', error);
            Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
        } finally {
            setNombre('');
            setEmail('');
            setPassword('');
        }
    };

    const handleGoogleSignup = () => {
        promptAsync();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 15 }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Welcome")}
                    style={{
                        position: "absolute",
                        top: 5,
                        zIndex: 999
                    }}
                >
                    <Ionicons name="arrow-back" size={22} color={COLORS.black} />
                </TouchableOpacity>
                <View style={{ marginVertical: 25 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', marginVertical: 12, color: COLORS.black }}>
                        Crea una Cuenta
                    </Text>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Conéctate hoy!</Text>
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Nombre </Text>
                    <TextInput
                        placeholder='Ingresa tu nombre'
                        placeholderTextColor={COLORS.black}
                        style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingLeft: 22
                        }}
                        value={nombre}
                        onChangeText={setNombre}
                    />
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Email </Text>
                    <TextInput
                        placeholder='Ingresa tu email'
                        placeholderTextColor={COLORS.black}
                        style={{
                            width: "100%",
                            height: 48,
                            borderColor: COLORS.black,
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingLeft: 22
                        }}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}>Password</Text>
                    <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        paddingLeft: 22
                    }}>
                        <TextInput
                            placeholder='Ingresa tu password, mínimo 6 caracteres'
                            placeholderTextColor={COLORS.black}
                            secureTextEntry={!isPasswordShown}
                            style={{ width: "100%" }}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShown(!isPasswordShown)}
                            style={{ position: "absolute", right: 12 }}
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
                    <Text>Acepto los términos y condiciones</Text>
                </View>
                <Button title="Registrarse" filled onPress={handleSignup} style={{ marginTop: 18, marginBottom: 4 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey, marginHorizontal: 10 }} />
                    <Text style={{ fontSize: 14 }}>O Regístrate con</Text>
                    <View style={{ flex: 1, height: 1, backgroundColor: COLORS.grey, marginHorizontal: 10 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                        onPress={handleGoogleSignup}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../assets/google.png")}
                            style={{ height: 36, width: 36, marginRight: 8 }}
                            resizeMode="contain"
                        />
                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 22 }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Ya tienes una cuenta</Text>
                    <Pressable onPress={() => navigation.navigate("Login")}>
                        <Text style={{ fontSize: 16, color: COLORS.primary, fontWeight: "bold", marginLeft: 6 }}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Signup;