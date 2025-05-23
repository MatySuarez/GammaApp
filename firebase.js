import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { registerWithGoogle, registerWithFacebook, registerWithApple } from './firebase';

const Signup = () => {
  const handleGoogleSignup = () => {
    registerWithGoogle();
  };

  const handleFacebookSignup = () => {
    registerWithFacebook();
  };

  const handleAppleSignup = () => {
    registerWithApple();
  };

  return (
    <View>
      <TouchableOpacity onPress={handleGoogleSignup}>
        <Text>Registrarse con Google</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFacebookSignup}>
        <Text>Registrarse con Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAppleSignup}>
        <Text>Registrarse con Apple</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
