import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, Linking } from "react-native";
import { useRouter } from "expo-router";

import styles from "./nearbyjobs.style";
import { COLORS } from "../../../constants";
import NearbyJobCard from "../../common/cards/nearby/NearbyJobCard";
import tmcfJobs from "../../../data/tmcf_jobs.json";
import uncfOpportunities from "../../../data/uncf_opportunities.json";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Nearbyjobs = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Combine and shuffle job opportunities from TMCF and UNCF
      const mergedData = shuffleArray([
        ...tmcfJobs.map(job => ({
          id: `tmcf-${job["Job Title"]}`,
          title: job["Job Title"],
          location: job["Location"],
          type: job["Type"],
          url: job["URL"],
        })),
        ...uncfOpportunities.map(opportunity => ({
          id: `uncf-${opportunity["Program Name"]}`,
          title: opportunity["Program Name"],
          location: "N/A", // No location info for UNCF programs
          type: opportunity["Program Type"],
          url: opportunity["Application Link"],
        }))
      ]);
      setData(mergedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommendations</Text>
        <TouchableOpacity>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong: {error}</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NearbyJobCard
                job={item}
                handleNavigate={() => Linking.openURL(item.url)}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Nearbyjobs;
