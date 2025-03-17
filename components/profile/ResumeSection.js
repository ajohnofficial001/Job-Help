import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { COLORS, FONT, SIZES } from '../../constants';

const ResumeSection = ({ 
  profileData, 
  isEditing, 
  handleUploadResume,
  handleDownloadResume,
  handleDeleteResume,
  isLoading,
  darkMode,
  colors
}) => {
  const hasResume = profileData && profileData.resume;
  
  // Log resume data when component renders or updates
  useEffect(() => {
    console.log('ResumeSection rendered with hasResume:', hasResume);
    if (hasResume) {
      console.log('Resume data:', {
        name: profileData.resume.name,
        size: profileData.resume.size,
        uploadDate: profileData.resume.uploadDate,
        hasBase64: !!profileData.resume.base64
      });
    }
  }, [profileData, hasResume]);
  
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <View style={[
      styles.section,
      { backgroundColor: darkMode ? colors.surface : COLORS.white }
    ]}>
      <Text style={[
        styles.sectionTitle,
        { color: darkMode ? colors.text : COLORS.primary }
      ]}>
        Resume
      </Text>
      
      {hasResume ? (
        <View style={styles.resumeContainer}>
          <View style={styles.resumeInfo}>
            <Text style={[
              styles.resumeName,
              { color: darkMode ? colors.text : COLORS.primary }
            ]}>
              {profileData.resume.name}
            </Text>
            
            <View style={styles.resumeDetails}>
              <Text style={[
                styles.resumeDetail,
                { color: darkMode ? colors.textSecondary : COLORS.gray }
              ]}>
                Size: {formatBytes(profileData.resume.size)}
              </Text>
              
              <Text style={[
                styles.resumeDetail,
                { color: darkMode ? colors.textSecondary : COLORS.gray }
              ]}>
                Uploaded: {formatDate(profileData.resume.uploadDate)}
              </Text>
            </View>
          </View>
          
          <View style={styles.resumeActions}>
            <TouchableOpacity 
              style={[styles.resumeButton, styles.downloadButton]}
              onPress={handleDownloadResume}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={styles.downloadButtonText}>Download</Text>
              )}
            </TouchableOpacity>
            
            {isEditing && (
              <TouchableOpacity 
                style={[styles.resumeButton, styles.deleteButton]}
                onPress={handleDeleteResume}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyResumeContainer}>
          <Text style={[
            styles.emptyText,
            { color: darkMode ? colors.textSecondary : COLORS.gray }
          ]}>
            Upload your resume to share with potential employers
          </Text>
          
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadResume}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Resume (PDF)</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      
      {hasResume && isEditing && (
        <TouchableOpacity 
          style={styles.updateButton}
          onPress={handleUploadResume}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.updateButtonText}>Update Resume</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: SIZES.large,
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.small,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontFamily: FONT.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  emptyResumeContainer: {
    alignItems: 'center',
    padding: SIZES.medium,
  },
  emptyText: {
    fontFamily: FONT.regular,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SIZES.small,
  },
  uploadButton: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.small,
    marginTop: SIZES.small,
  },
  uploadButtonText: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  resumeContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: SIZES.small,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },
  resumeInfo: {
    marginBottom: SIZES.small,
  },
  resumeName: {
    fontFamily: FONT.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    marginBottom: SIZES.small / 2,
  },
  resumeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumeDetail: {
    fontFamily: FONT.regular,
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  resumeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SIZES.small,
  },
  resumeButton: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    marginLeft: SIZES.small,
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
  },
  downloadButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: COLORS.tertiary,
  },
  deleteButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  updateButton: {
    backgroundColor: COLORS.tertiary,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.small,
    alignSelf: 'center',
    marginTop: SIZES.small,
  },
  updateButtonText: {
    fontFamily: FONT.medium,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
});

export default ResumeSection; 