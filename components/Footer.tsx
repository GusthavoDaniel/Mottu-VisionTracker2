import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const MOTTU_BLACK = "#121212";
const MOTTU_LIGHT_GRAY = "#A0A0A0";

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2025 Mottu Pátio App - Todos os direitos reservados.</Text>
      <Text style={styles.footerText}>Versão 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: MOTTU_BLACK,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333', 
  },
  footerText: {
    fontSize: 12,
    color: MOTTU_LIGHT_GRAY,
    textAlign: 'center',
    marginBottom: 3,
  },
});

export default Footer;

