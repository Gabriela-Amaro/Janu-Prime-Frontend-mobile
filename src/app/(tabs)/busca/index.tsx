import React from "react";
import { Text, View } from "react-native";
import { ScreenContainer } from "../../../components/ScreenContainer/tabs/ScreenContainer";

export default function Busca() {
  return (
    <ScreenContainer headerContent={<Text>Header</Text>}>
      {/* Conteúdo da busca */}
      <View>
        <Text>Body</Text>
      </View>
    </ScreenContainer>
  );
}
