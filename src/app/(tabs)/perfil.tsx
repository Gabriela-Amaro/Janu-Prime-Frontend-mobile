import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "../../components/ScreenContainer/tabs/ScreenContainer";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "../../constants/Colors";
import { FontFamily, FontSize } from "../../constants/Fonts";

export default function Perfil() {
  const { user, signOut } = useAuth();

  function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <ScreenContainer
      headerContent={
        <Text style={styles.headerTitle}>Perfil</Text>
      }
    >
      <View style={styles.content}>
        {/* Info do usuário */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nome?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.nome ?? "Usuário"}</Text>
          <Text style={styles.userEmail}>{user?.email ?? ""}</Text>
        </View>

        {/* Botão Sair */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.medium,
    color: colors.black[900],
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brown[800],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: FontFamily.bold,
    color: colors.white,
  },
  userName: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.medium,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: FontSize.description,
    fontFamily: FontFamily.regular,
    color: colors.gray[700],
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: colors.brown[800],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  logoutText: {
    color: colors.white,
    fontSize: FontSize.body,
    fontFamily: FontFamily.bold,
  },
});
