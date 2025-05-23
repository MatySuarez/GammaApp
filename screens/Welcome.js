import React from 'react';
import { View, Text, Pressable, Image, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.secondary, COLORS.primary]}
        >
            <View style={styles.innerContainer}>
                {/*
                <Image source={require("../assets/logo-gamma3.png")} style={styles.logo} />
                 */}
                
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../assets/perros-selfie.png")}
                        style={styles.image}
                    />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title}>Gamma<Text style={styles.subtitle}>Feed</Text></Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Bienvenidos al futuro.</Text>
                        <Text style={styles.text}>Siempre innovando pensando en ellos.</Text>
                    </View>

                    <Button
                        title="Registrate Ahora"
                        onPress={() => navigation.navigate("Signup")}
                        style={styles.button}
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Ya tienes una cuenta ?</Text>
                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={[styles.loginText, styles.boldText]}><Text style={styles.loginText2}>Login</Text></Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '5%',
    },
    
    logo: {
        position: 'absolute',
        top: height * 0.1,
        left: width * 0.05,
        zIndex: 999,
        height: height * 0.055,
        width: width * 0.045,
    },
    
    imageContainer: {
        alignItems: 'center',
        marginTop: height * 0.05,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    image: {
        height: height * 0.38,
        width: height * 0.38,
       //borderRadius: (height * 0.35) / 2,
        borderTopLeftRadius: 70,
        borderBottomRightRadius: 70,
       
    },
    content: {
        marginTop: height * 0.05,
        alignItems: 'center',
    },
    title: {
        fontSize: height * 0.05,
        fontWeight: '800',
        color: COLORS.white,
    },
    subtitle: {
        color: COLORS.violet,
        fontStyle: 'italic',
    },
    textContainer: {
        alignItems: 'center',
        marginVertical: height * 0.02,
    },
    text: {
        fontSize: height * 0.02,
        color: COLORS.white,
        marginBottom: height * 0.01,
    },
    button: {
        width: width * 0.8,
        marginTop: height * 0.001,
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontSize: height * 0.02,
        color: COLORS.white,
        top: 10
    },
    loginText2: {
        fontSize: height * 0.02,
        color: COLORS.violet,
        top: 10,
        fontStyle: 'italic',
        fontWeight: '800'
    },
    boldText: {
        fontWeight: 'bold',
        marginLeft: width * 0.01,
    },
});

export default Welcome;
