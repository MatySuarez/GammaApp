import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView, FlatList, SafeAreaView, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from '../constants/colors';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import BottomBar from '../components/BottomBar';

const Api = ({route, navigation , mascotaData, comidas }) => {
  const [breed, setBreed] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dogInfo, setDogInfo] = useState(null);
  const [isHomeScreen, setIsHomeScreen] = useState(false);
  const [isRegistroMascotaScreen, setIsRegistroMascotaScreen] = useState(false);
  const [isConfiguracionComidaScreen, setIsConfiguracionComidaScreen] = useState(false);
  const [isApiScreen, setIsApiScreen] = useState(true);
  const [isBreedSelected, setIsBreedSelected] = useState(false); // Nuevo estado para controlar selección de raza

  const fetchBreedSuggestions = async () => {
    const apiKey = 'live_BT9qy8yV6um2EanLdss5aVxyrrkXMxfgn6ZKItz9eZrKV1enBPmohMgoG0SMHQzq'; // Tu clave de API
    try {
      const breedResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`, {
        headers: {
          'x-api-key': apiKey
        }
      });

      const breedSuggestions = breedResponse.data.map(breedData => breedData.name);
      setSuggestions(breedSuggestions);

    } catch (error) {
      console.error('Error fetching breed suggestions:', error);
      setSuggestions([]);
    }
  };

  const fetchBreedInfo = async () => {
    const apiKey = 'live_BT9qy8yV6um2EanLdss5aVxyrrkXMxfgn6ZKItz9eZrKV1enBPmohMgoG0SMHQzq'; // Tu clave de API
    try {
      const breedResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`, {
        headers: {
          'x-api-key': apiKey
        }
      });

      if (breedResponse.data.length === 0) {
        throw new Error('Breed not found');
      }

      const breedData = breedResponse.data[0];
      setDogInfo({
        image: breedData.image.url,
        name: breedData.name,
        life_span: breedData.life_span,
        temperament: breedData.temperament,
        weight: breedData.weight.metric,
        height: breedData.height.metric
      });

    } catch (error) {
      Alert.alert('Error', error.message);
      setDogInfo(null);
    }
  };

  useEffect(() => {
    if (breed.length > 0 && !isBreedSelected) {
      fetchBreedSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [breed, isBreedSelected]); // Incluye isBreedSelected en las dependencias

  // Limpia la selección cuando la pantalla pierde el enfoque
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setBreed('');
        setSuggestions([]);
        setDogInfo(null);
        setIsBreedSelected(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscador de razas</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la raza (ej., labrador)"
        value={breed}
        onChangeText={(text) => {
          setBreed(text);
          setIsBreedSelected(false); // Resetea la selección al modificar el texto
        }}      />

       {!isBreedSelected && suggestions.length > 0 && (        <FlatList
          data={suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setBreed(item);
                setSuggestions([]);
                setIsBreedSelected(true); // Marca que se ha seleccionado una raza
              }}
            >
            <Text>{item}</Text> 
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.suggestionsContainer}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={fetchBreedInfo}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      {dogInfo && (
        <ScrollView style={styles.infoContainer}>
          <View style={styles.conteinerFoto}> 
          <Image source={{ uri: dogInfo.image }} style={styles.image} />
          </View>
          <View style={styles.conteinerText}>
          <Text style={styles.descriptionText}>Raza: <Text style={styles.descriptionText2}> {dogInfo.name}</Text></Text>
          <Text style={styles.descriptionText}>Expectativa de vida: <Text style={styles.descriptionText2}> {dogInfo.life_span}</Text></Text>
          <Text style={styles.descriptionText}>Temperamento: <Text style={styles.descriptionText2}>{dogInfo.temperament}</Text></Text>
          <Text style={styles.descriptionText}>Peso: <Text style={styles.descriptionText2}>{dogInfo.weight}</Text> kg</Text>
          <Text style={styles.descriptionText}>Atura: <Text style={styles.descriptionText2}>{dogInfo.height}</Text> cm</Text>
          </View>
        </ScrollView>
      )}
       <View style={styles.bottomBarContainer}> 
       <BottomBar
        navigation={navigation}
        isHomeScreen={false}
        isRegistroMascotaScreen={false}
        isConfiguracionComidaScreen={false}
        isApiScreen={true}
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
    //top: 33
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffff0',
    //top: 33
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    height: 60,
    width: '80%',
    marginVertical: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    borderColor: COLORS.primary,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.primary,
  },
  suggestionsContainer: {
    width: '80%',
    maxHeight: 150,
    marginBottom: 20,
    backgroundColor: '#fffff0',
    borderRadius: 10,
    elevation: 5,
  },
  conteinerFoto: {
    shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderTopLeftRadius: 45,
    borderBottomRightRadius: 45,
    alignSelf: 'center'

  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
  },
  infoContainer: {
    width: '100%',
    marginTop: 20,
    alignContent: 'center',
  },
  conteinerText: {
    justifyContent: 'center',
    
  },
  descriptionText: {
    top: 20,
    fontSize: 16,
    marginTop: 5,
    padding: 3,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  descriptionText2: {
    top: 20,
    fontSize: 16,
    marginTop: 5,
    padding: 3,
    alignSelf: 'center',
    fontStyle: 'italic',
    fontWeight: '400'
  },
  bottomBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -30,
  },
});

export default Api;
