import React from "react";
import { Text, View } from "react-native";
import { CarrosselImagens } from "../../../components/CarrosselImagens";
import { PointsBadge } from "../../../components/PointsBadge";
import { ScreenContainer } from "../../../components/ScreenContainer/tabs/ScreenContainer";
import { styles } from "./styles";

export default function Home() {
  return (
    <ScreenContainer
      headerContent={
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Olá, Gabriela!</Text>
          
          <PointsBadge points={2067} />
        </View>
      }
    >
      <View style={styles.content}>
        <Text style={[styles.sectionTitle, {marginTop: 8}]}>Ofertas</Text>
        <CarrosselImagens />
        
        <Text style={styles.sectionTitle}>Lojas</Text>
        {/* Lista de lojas vai aqui */}
      </View>
    </ScreenContainer>
  );
}

