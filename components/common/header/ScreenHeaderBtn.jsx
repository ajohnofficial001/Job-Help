import React from "react";
import { TouchableOpacity, Image } from "react-native";

import styles from "./screenheader.style";

const ScreenHeaderBtn = ({ iconUrl, dimension, handlePress }) => {
  // Check if iconUrl is a URI object or a local image
  const isUriObject = iconUrl && typeof iconUrl === 'object' && iconUrl.uri;
  
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
      <Image
        source={iconUrl}
        resizeMode="cover"
        style={[
          styles.btnImg(dimension),
          isUriObject ? { borderRadius: 50 } : {}
        ]}
      />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
