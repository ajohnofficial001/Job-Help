import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./nearbyjobcard.style";
import { checkImageURL } from "../../../../utils";

const tmcfLogo = "https://www.tmcf.org/wp-content/uploads/2015/06/logo-for-open-graph.png";
const uncfLogo = "https://uncf.org/wp-content/uploads/staff/pic_placeholder2.jpg";

const NearbyJobCard = ({ job, handleNavigate }) => {
  const logoSource = job.id.startsWith("tmcf")
    ? tmcfLogo
    : job.id.startsWith("uncf")
    ? uncfLogo
    : "https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg";

  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: logoSource }} resizeMode='contain' style={styles.logoImage} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {job?.title}
        </Text>
        <Text style={styles.jobType}>{job?.type}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NearbyJobCard;
