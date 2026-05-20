import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PLAYLISTS, type PlaylistId } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type PlaylistCardVariant = 'default' | 'featured' | 'compact';

interface PlaylistCardProps {
  playlistId: PlaylistId;
  onPress: () => void;
  variant?: PlaylistCardVariant;
  songCount?: number;
}

export function PlaylistCard({ playlistId, onPress, variant = 'default', songCount }: PlaylistCardProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const playlist = PLAYLISTS[playlistId];
  const iconName = playlist.icon;

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={[
          styles.compactCard,
          { borderColor: colors.tint, backgroundColor: colors.tint + '15' }
        ]}
        onPress={onPress}
        accessibilityLabel={playlist.name}
        accessibilityRole="button"
        activeOpacity={0.7}>
        <ThemedView style={[styles.compactIconContainer, { backgroundColor: colors.tint + '20' }]}>
          <IconSymbol name={iconName} size={24} color={colors.tint} />
        </ThemedView>
        <ThemedText type="defaultSemiBold" style={styles.compactName} numberOfLines={1}>
          {playlist.name}
        </ThemedText>
      </TouchableOpacity>
    );
  }

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[
          styles.featuredCard,
          { borderColor: colors.tint, backgroundColor: colors.tint + '15' }
        ]}
        onPress={onPress}
        accessibilityLabel={playlist.name}
        accessibilityRole="button"
        activeOpacity={0.7}>
        <View style={styles.featuredTopRow}>
          <ThemedView style={[styles.featuredIconContainer, { backgroundColor: colors.tint + '20' }]}>
            <IconSymbol name={iconName} size={36} color={colors.tint} />
          </ThemedView>
          {songCount !== undefined && (
            <View style={[styles.songCountBadge, { backgroundColor: colors.tint + '20' }]}>
              <ThemedText style={[styles.songCountText, { color: colors.tint }]}>
                {t('songList.count', { count: songCount })}
              </ThemedText>
            </View>
          )}
        </View>
        <View style={styles.featuredText}>
          <ThemedText type="subtitle" style={styles.featuredName}>
            {playlist.name}
          </ThemedText>
          <ThemedText style={styles.featuredDescription}>
            {t(playlist.descriptionKey)}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

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
          {t(playlist.descriptionKey)}
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
  featuredCard: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  featuredIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  songCountText: {
    fontSize: 13,
    fontWeight: '600',
  },
  featuredText: {
    gap: 4,
  },
  featuredName: {
    fontSize: 22,
  },
  featuredDescription: {
    opacity: 0.7,
    fontSize: 14,
  },
  compactCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  compactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactName: {
    flex: 1,
    fontSize: 14,
  },
});
