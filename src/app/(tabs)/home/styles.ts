
import { StyleSheet } from "react-native";
import { colors } from "../../../constants/Colors";
import { FontFamily, FontSize } from "../../../constants/Fonts";

export const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greeting: {
    fontSize: FontSize.title,
    fontFamily: FontFamily.medium,
    color: colors.black[900],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: FontSize.subtitle,
    fontFamily: FontFamily.medium,
    color: colors.gray[700],
    paddingLeft: 8,
    marginTop: 16,
    marginBottom: 16,
    
  },
});