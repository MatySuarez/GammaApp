import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';  // Asegúrate de importar correctamente el hook de contexto
import COLORS from '../constants/colors';
import { lightTheme, darkTheme } from '../context/Themes.js';
import {  useThemeUpdate } from '../context/ThemeContext';  // Asegúrate de importar correctamente los hooks de contexto

const Configuracion = ({ navigation }) => {
    const Theme = useTheme();  // Usa el tema actual
    const toggleTheme = useThemeUpdate();  // Función para cambiar el tema
    return (
        <View style={[styles.container, { backgroundColor: Theme === 'dark' ? COLORS.darkBackground : COLORS.lightBackground }]}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.backButton}
            >
                <Ionicons name="arrow-back" size={28} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: Theme === 'dark' ? COLORS.lightText : COLORS.darkText }]}>
                Configuración
            </Text>
            <View style={styles.settingsContainer}>
                <Text style={[styles.settingItem, { color: Theme === 'dark' ? COLORS.lightText : COLORS.darkText }]}>
                    Modo Oscuro
                </Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={Theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleTheme}
                    value={Theme === 'dark'}
                    
                />
            </View>
            {/* Aquí puedes agregar más configuraciones, como la selección de zona horaria */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        top: 70
    },
    backButton: {
        position: "absolute",
        top: 5,
        left: 20,
        zIndex: 999
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center'
    },
    settingsContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10
    },
    settingItem: {
        fontSize: 18
    }
});

export default Configuracion;
