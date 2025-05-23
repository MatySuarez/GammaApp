import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, updatePassword, updateEmail } from 'firebase/auth';
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../constants/colors';


const Cuenta = ({ navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [email, setEmail] = useState(user ? user.email : '');
    const [password, setPassword] = useState('');
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);

    const handleUpdateEmail = async () => {
        if (!email.trim()) {
            Alert.alert("Error", "El campo del correo no puede estar vacío.");
            return;
        }
        try {
            await updateEmail(user, email);
            Alert.alert("Actualización exitosa", "Tu correo electrónico ha sido actualizado.");
            setIsEditingEmail(false);
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    const handleUpdatePassword = async () => {
        if (!password.trim()) {
            Alert.alert("Error", "El campo de la contraseña no puede estar vacío.");
            return;
        }
        try {
          await updatePassword(user, password);
          // Cambia aquí para incluir la redirección en la función de callback del botón "OK" del Alert.
          Alert.alert("Actualización exitosa", "Tu contraseña ha sido actualizada.", [
              { text: "OK", onPress: () => navigation.navigate("Home") }
          ]);
          setIsEditingPassword(false);
          setPassword(''); // Limpia el campo después de actualizar
      } catch (error) {
          Alert.alert("Error al actualizar", error.message);
      }
    };
  return (
    <View style={styles.container}>
         <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                   
                >
                    <Ionicons name="arrow-back" size={28} color={COLORS.black} />
                </TouchableOpacity>
           <Text style={styles.titulo}>Perfil</Text>
                   
      <View style={styles.field}>
        <Text>Email: </Text>
        {isEditingEmail ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoFocus
          />
        ) : (
          <Text>{email}                             </Text>
        )}
        {/*
        <TouchableOpacity onPress={() => setIsEditingEmail(!isEditingEmail)}>
          <Icon name="pencil" size={20} color="black" />
        </TouchableOpacity>
    */}
      </View>

      <View style={styles.field}>
        <Text>Contraseña: </Text>
        {isEditingPassword ? (
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            autoFocus
          />
        ) : (
          <Text>********                                                  </Text>
        )}
        <TouchableOpacity onPress={() => setIsEditingPassword(!isEditingPassword)} >
          <Icon name="pencil" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {isEditingEmail && <TouchableOpacity onPress={handleUpdateEmail} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Email</Text>
      </TouchableOpacity>}

      {isEditingPassword && <TouchableOpacity onPress={handleUpdatePassword} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Contraseña</Text>
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
   top:70
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    top: 50,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: 10,
    padding: 12,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    top: 220,
    width: '50%',
    left: 95,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'white'
  }
});

export default Cuenta;
