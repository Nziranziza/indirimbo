import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PLAYLISTS, type PlaylistId } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type IconSymbolName = ComponentProps<typeof IconSymbol>['name'];

interface PlaylistCardProps {
  playlistId: PlaylistId;
  iconName: IconSymbolName;
  onPress: () => void;
}

export function PlaylistCard({ playlistId, iconName, onPress }: PlaylistCardProps) {
  const colors = useColors();
  const playlist = PLAYLISTS[playlistId];

  return (
    <TouchableOpacity
      style={[
        styles.playlistCard,
        {
          borderColor: colors.tint,
          backgroundColor: colors.tint + '15',
        }
      ]}
      onPress={onPress}
      accessibilityLabel={playlist.name}
      accessibilityRole="button"
      activeOpacity={0.7}>
      <ThemedView
        style={[
          styles.playlistIconContainer,
          { backgroundColor: colors.tint + '20' }
        ]}>
        <IconSymbol name={iconName} size={40} color={colors.tint} />
      </ThemedView>
      <View style={styles.playlistInfo}>
        <ThemedText type="subtitle" style={styles.playlistName}>
          {playlist.name}
        </ThemedText>
        <ThemedText style={styles.playlistDescription}>
          {playlist.description}
        </ThemedText>
      </View>
      <IconSymbol name="arrow.right" size={24} color={colors.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  playlistIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    marginBottom: 4,
  },
  playlistDescription: {
    opacity: 0.7,
    fontSize: 14,
  },
});
