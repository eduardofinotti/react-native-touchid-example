import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight, View, AsyncStorage, TouchableOpacity, Alert } from 'react-native';

import AuthInput from './components/AuthInput'

import Modal from 'react-native-modal';
import TouchID from "react-native-touch-id";

function authenticate() {
  return TouchID.authenticate()
    .then(success => {
      AlertIOS.alert('Authenticated Successfully');
    })
    .catch(error => {
      console.log(error)
      AlertIOS.alert(error.message);
    });
}

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      biometryType: null,
      isPassword: null,
      modalOpen: false,

      password: null,
      confirmPassword: null,
    };
  }

  clickHandler() {
    TouchID.isSupported()
      .then(authenticate)
      .catch(error => {
        alert('TouchID not supported');
      });
  }

  componentWillMount() {
    // AsyncStorage.setItem('password', "");
    
    TouchID.isSupported()
    .then(biometryType => {
      this.setState({ biometryType });
    })
    .catch(error => {
      this.setState({ biometryType: "TouchID" });
    });

    this.checkPassword()
  }
  
  async checkPassword() {
    let pass = null;

    try {
      pass = await AsyncStorage.getItem('password') || null;  
      
      if (pass != null) {
        this.setState({ isPassword: true });
      } 
      
      console.log("pass: " + this.state.isPassword)

    } catch (error) {
      console.log(error)
    }

  }

  openPopupPassword = () => {
    this.setState({ modalOpen: true })
  }

  closePopupPassword = () => {
    this.setState({ modalOpen: false })
  }

  loginUp = () => {
    this.setState({ keyboardOpen: true })
  }

  loginDown = () => {
    this.setState({ keyboardOpen: false })
  }

  async createPassword(){
    if (this.state.password == this.state.confirmPassword) {
      try {
        await AsyncStorage.setItem('password', this.state.password);
        this.setState({ modalOpen: false })
        this.props.navigation.navigate('Home')
        this.setState({ password: null })
        this.setState({ confirmPassword: null })
        this.setState({ isPassword: true })
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  async enter(){
    let pass = null;

    try {
      pass = await AsyncStorage.getItem('password') || null;  
      
      if (pass == this.state.password) {
        this.setState({ modalOpen: false })
        this.props.navigation.navigate('Home')
        this.setState({ password: null })
        this.setState({ confirmPassword: null })
      } else {
        alert('Senha errada :(')
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  render() {

    return (
      <View style={styles.container}>

        <View style={styles.loginContainer}>
          <TouchableHighlight style={styles.button}
            onPress={this.clickHandler}
            underlayColor="#0380BE"
            activeOpacity={1} >
            <Text style={styles.buttonText}>{`${this.state.biometryType}`}</Text>
          </TouchableHighlight>

          <TouchableHighlight style={styles.button}
            onPress={this.openPopupPassword}
            underlayColor="#0380BE"
            activeOpacity={1} >
            <Text style={styles.buttonText}>Password</Text>
          </TouchableHighlight>
        </View>

        <Modal
          testID={'modal'}
          isVisible={this.state.modalOpen}
          onSwipeComplete={this.closePopupPassword}
          onBackdropPress={this.closePopupPassword}
          animationOut={'slideOutDown'}
          swipeDirection={['down']}
          style={styles.modal}>

          <View style={[styles.scrollableModal]}>
            <View style={styles.scrollableModalContent1}>

              <Text style={styles.label}>{this.state.isPassword?`Entre com sua senha! :)`:`Você ainda nao criou uma senha. \nCrie sua senha agora! :)`}</Text>

              <AuthInput icon='lock' secureTextEntry={true} placeholder='Password' style={styles.input} 
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })} 
                        onFocus={() => this.loginUp()}
                        onBlur={() => this.loginDown()}
              />
              {!this.state.isPassword && 
                <View>
                  <AuthInput icon='lock' secureTextEntry={true} placeholder='Confirm Password' style={styles.input} 
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({ confirmPassword })} 
                            onFocus={() => this.loginUp()}
                            onBlur={() => this.loginDown()}
                  />
                </View>
              }

              {!this.state.isPassword && 
                <View> 
                  <TouchableOpacity onPress={() => this.createPassword()} >
                      <View style={styles.button} >
                          <Text style={styles.buttonText}>Create password</Text>
                      </View>
                  </TouchableOpacity>
                </View>
              }

              {this.state.isPassword && 
                <View> 
                  <TouchableOpacity onPress={() => this.enter()} >
                      <View style={styles.button} >
                          <Text style={styles.buttonText}>Enter</Text>
                      </View>
                  </TouchableOpacity>
                </View>
              }

            </View>
          </View>
        
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF', 
  },
  loginContainer:{
    flexDirection: 'row'
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7',
    borderColor: 'white',
    borderWidth: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
  label: {
    color: 'white',
    fontWeight: '600',
    margin: 20
  },
  modal: {
    justifyContent: 'center',
  },

  scrollableModal: {
    width: '100%',
    backgroundColor: '#0391D7',
    borderRadius: 10,
    alignItems: 'center',
    height: 250,
  },
  scrollableModalContent1: {
    justifyContent: 'center',
  },

  input: {
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  
});