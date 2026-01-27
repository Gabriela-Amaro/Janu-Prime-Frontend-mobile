import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/Colors";
import Icon from "../../constants/icons";
import { styles } from "./styles";

interface PointsBadgeProps {
  points: number;
}

export function PointsBadge({ points }: PointsBadgeProps) {
  return (
    <TouchableOpacity onPress={() => {}} style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{points}</Text>
      </View>
      <Icon name="coins" size={24} color={colors.white} />
    </TouchableOpacity>
  );
}