import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import styles from "./welcome.style";
import { icons, SIZES } from "../../../constants";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";

const jobTypes = ["Full-time", "Part-time", "Contractor"];

const Welcome = ({ searchTerm, setSearchTerm, handleClick }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { darkMode, colors } = useTheme();
  const [activeJobType, setActiveJobType] = useState("Full-time");

  return (
    <View>
      <View style={styles.container}>
        <Text style={[styles.userName, { color: darkMode ? colors.text : null }]}>
          {user ? `Hello ${user.firstName}!` : "Hello there!"}
        </Text>
        <Text style={[styles.welcomeMessage, { color: darkMode ? colors.textSecondary : null }]}>
          Find your perfect job
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchWrapper, { backgroundColor: darkMode ? colors.surface : null }]}>
          <TextInput
            style={[styles.searchInput, { color: darkMode ? colors.text : null }]}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            placeholder='What are you looking for?'
            placeholderTextColor={darkMode ? colors.textSecondary : null}
          />
        </View>

        <TouchableOpacity 
          style={[styles.searchBtn, { backgroundColor: darkMode ? colors.accent : null }]} 
          onPress={handleClick}
        >
          <Image
            source={icons.search}
            resizeMode='contain'
            style={styles.searchBtnImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <FlatList
          data={jobTypes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tab(activeJobType, item)}
              onPress={() => {
                setActiveJobType(item);
                router.push(`/search/${item}`);
              }}
            >
              <Text style={styles.tabText(activeJobType, item)}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={{ columnGap: SIZES.small }}
          horizontal
        />
      </View>
    </View>
  );
};

export default Welcome;